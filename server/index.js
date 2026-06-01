import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import pathModule from 'path';
import { query, initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5180;
const JWT_SECRET = process.env.JWT_SECRET || 'plan360_secret_key';

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Database
initDb().then(() => {
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user; // { id, username, email }
    next();
  });
}

// --- AUTHENTICATION ROUTES ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, settings } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username.trim(), email.trim().toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo electrónico ya está registrado.' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default Settings JSON
    const defaultSettings = settings ? JSON.stringify(settings) : JSON.stringify({
      username: username.trim(),
      currency: 'COP',
      extraIncomeGoal: 4000000,
      dailyEnglishGoal: 1,
      weeklyGymGoal: 4,
      weeklyRunningGoal: 20,
      monthlyBudget: 3500000,
      customCategories: [
        "Salario", "Ingreso extra", "Alimentación", "Transporte", "Vivienda", 
        "Servicios", "Salud", "Gym", "Running", "Ropa", "Ocio", "Familia", 
        "Deudas", "Ahorro", "Educación", "Proyecto digital", "Otros"
      ],
      theme: 'femenino',
      profilePic: '',
      subscriptionPlan: 'Pro',
      subscriptionRenewal: '2026-12-31',
      subscriptionStatus: 'Activa'
    });

    // Insert User
    const result = await query(
      'INSERT INTO users (username, email, password, settings_json) VALUES ($1, $2, $3, $4) RETURNING id',
      [username.trim(), email.trim().toLowerCase(), hashedPassword, defaultSettings]
    );

    const userId = result.rows[0].id;

    // Generate JWT Token
    const token = jwt.sign({ id: userId, username: username.trim(), email: email.trim().toLowerCase() }, JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        settings: JSON.parse(defaultSettings)
      }
    });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Error interno en el registro.' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Find User (either by username or email)
    let result = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      // Auto-register demo user Kari if not found
      if (username.trim().toLowerCase() === 'kari' && password === '123') {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123', salt);
        const defaultSettings = JSON.stringify({
          username: 'Kari',
          currency: 'COP',
          extraIncomeGoal: 4000000,
          dailyEnglishGoal: 1,
          weeklyGymGoal: 4,
          weeklyRunningGoal: 20,
          monthlyBudget: 3500000,
          customCategories: [
            "Salario", "Ingreso extra", "Alimentación", "Transporte", "Vivienda", 
            "Servicios", "Salud", "Gym", "Running", "Ropa", "Ocio", "Familia", 
            "Deudas", "Ahorro", "Educación", "Proyecto digital", "Otros"
          ],
          theme: 'femenino',
          profilePic: '',
          subscriptionPlan: 'Pro',
          subscriptionRenewal: '2026-12-31',
          subscriptionStatus: 'Activa'
        });

        await query(
          'INSERT INTO users (username, email, password, settings_json) VALUES ($1, $2, $3, $4)',
          ['Kari', 'kari@demo.com', hashedPassword, defaultSettings]
        );

        result = await query('SELECT * FROM users WHERE username = $1', ['Kari']);
      } else {
        return res.status(400).json({ error: 'Credenciales inválidas.' });
      }
    }

    const user = result.rows[0];

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        settings: user.settings_json ? JSON.parse(user.settings_json) : null
      }
    });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Error interno en el inicio de sesión.' });
  }
});

// Get User Profile & Full State
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT id, username, email, settings_json FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const user = result.rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      settings: user.settings_json ? JSON.parse(user.settings_json) : null
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Error interno al obtener datos del usuario.' });
  }
});

// --- SETTINGS ---
app.post('/api/settings', authenticateToken, async (req, res) => {
  try {
    await query(
      'UPDATE users SET settings_json = $1 WHERE id = $2',
      [JSON.stringify(req.body), req.user.id]
    );
    res.json({ success: true, settings: req.body });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Error al actualizar configuraciones.' });
  }
});

// --- FOCUS PLANS ---
app.get('/api/focus-plans', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM focus_plans WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching focus plans:', err);
    res.status(500).json({ error: 'Error al obtener planes de enfoque.' });
  }
});

app.post('/api/focus-plans', authenticateToken, async (req, res) => {
  const { id, name, icon, color, target, unit, timeframeType, timeframeValue, createdAt } = req.body;
  try {
    // UPSERT style implementation
    const exist = await query('SELECT id FROM focus_plans WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (exist.rows.length > 0) {
      await query(
        `UPDATE focus_plans SET name = $1, icon = $2, color = $3, target = $4, unit = $5, timeframe_type = $6, timeframe_value = $7 
         WHERE id = $8 AND user_id = $9`,
        [name, icon, color, target, unit, timeframeType, timeframeValue, id, req.user.id]
      );
    } else {
      await query(
        `INSERT INTO focus_plans (id, user_id, name, icon, color, target, unit, timeframe_type, timeframe_value, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [id, req.user.id, name, icon, color, target, unit, timeframeType, timeframeValue, createdAt]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving focus plan:', err);
    res.status(500).json({ error: 'Error al guardar plan de enfoque.' });
  }
});

app.delete('/api/focus-plans/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM focus_plans WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting focus plan:', err);
    res.status(500).json({ error: 'Error al eliminar plan de enfoque.' });
  }
});

// --- FOCUS SESSIONS ---
app.get('/api/focus-sessions', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT fs.* FROM focus_sessions fs 
       JOIN focus_plans fp ON fs.plan_id = fp.id 
       WHERE fs.user_id = $1`, 
      [req.user.id]
    );
    res.json(result.rows.map(row => ({
      id: row.id,
      planId: row.plan_id,
      date: row.date,
      value: row.value,
      details: row.details,
      notes: row.notes
    })));
  } catch (err) {
    console.error('Error fetching focus sessions:', err);
    res.status(500).json({ error: 'Error al obtener sesiones.' });
  }
});

app.post('/api/focus-sessions', authenticateToken, async (req, res) => {
  const { id, planId, date, value, details, notes } = req.body;
  try {
    const exist = await query('SELECT id FROM focus_sessions WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (exist.rows.length > 0) {
      await query(
        'UPDATE focus_sessions SET plan_id = $1, date = $2, value = $3, details = $4, notes = $5 WHERE id = $6 AND user_id = $7',
        [planId, date, value, details, notes, id, req.user.id]
      );
    } else {
      await query(
        'INSERT INTO focus_sessions (id, plan_id, user_id, date, value, details, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, planId, req.user.id, date, value, details, notes]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving focus session:', err);
    res.status(500).json({ error: 'Error al guardar sesión.' });
  }
});

app.delete('/api/focus-sessions/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM focus_sessions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting focus session:', err);
    res.status(500).json({ error: 'Error al eliminar sesión.' });
  }
});

// --- TRANSACTIONS (FINANCES) ---
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, id DESC', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      date: row.date,
      type: row.type,
      category: row.category,
      description: row.description,
      amount: row.amount,
      paymentMethod: row.payment_method,
      status: row.status
    })));
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Error al obtener transacciones.' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { id, date, type, category, description, amount, paymentMethod, status } = req.body;
  try {
    const exist = await query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (exist.rows.length > 0) {
      await query(
        `UPDATE transactions SET date = $1, type = $2, category = $3, description = $4, amount = $5, payment_method = $6, status = $7 
         WHERE id = $8 AND user_id = $9`,
        [date, type, category, description, amount, paymentMethod, status, id, req.user.id]
      );
    } else {
      await query(
        `INSERT INTO transactions (id, user_id, date, type, category, description, amount, payment_method, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [id, req.user.id, date, type, category, description, amount, paymentMethod, status]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving transaction:', err);
    res.status(500).json({ error: 'Error al guardar transacción.' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Error al eliminar transacción.' });
  }
});

// --- HABITS ---
app.get('/api/habits', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM habits WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      frequency: row.frequency,
      target: row.target,
      unit: row.unit,
      logs: row.logs_json ? JSON.parse(row.logs_json) : {}
    })));
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ error: 'Error al obtener hábitos.' });
  }
});

app.post('/api/habits', authenticateToken, async (req, res) => {
  const { id, name, frequency, target, unit, logs } = req.body;
  try {
    const exist = await query('SELECT id FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    const logsJson = JSON.stringify(logs || {});
    if (exist.rows.length > 0) {
      await query(
        'UPDATE habits SET name = $1, frequency = $2, target = $3, unit = $4, logs_json = $5 WHERE id = $6 AND user_id = $7',
        [name, frequency, target, unit, logsJson, id, req.user.id]
      );
    } else {
      await query(
        'INSERT INTO habits (id, user_id, name, frequency, target, unit, logs_json) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, req.user.id, name, frequency, target, unit, logsJson]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving habit:', err);
    res.status(500).json({ error: 'Error al guardar hábito.' });
  }
});

app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ error: 'Error al eliminar hábito.' });
  }
});

// --- EVENTS ---
app.get('/api/events', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM events WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      activityType: row.activity_type,
      description: row.description,
      status: row.status
    })));
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Error al obtener eventos.' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const { id, title, date, time, activityType, description, status } = req.body;
  try {
    const exist = await query('SELECT id FROM events WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (exist.rows.length > 0) {
      await query(
        `UPDATE events SET title = $1, date = $2, time = $3, activity_type = $4, description = $5, status = $6 
         WHERE id = $7 AND user_id = $8`,
        [title, date, time, activityType, description, status, id, req.user.id]
      );
    } else {
      await query(
        `INSERT INTO events (id, user_id, title, date, time, activity_type, description, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, req.user.id, title, date, time, activityType, description, status]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving event:', err);
    res.status(500).json({ error: 'Error al guardar evento.' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM events WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Error al eliminar evento.' });
  }
});

// --- CRM PROSPECTS ---
app.get('/api/prospects', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM prospects WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      company: row.company,
      contact: row.contact,
      phone: row.phone,
      email: row.email,
      need: row.need,
      serviceOffered: row.service_offered,
      valueProposed: row.value_proposed,
      status: row.status,
      nextStep: row.next_step,
      followUpDate: row.follow_up_date,
      notes: row.notes
    })));
  } catch (err) {
    console.error('Error fetching prospects:', err);
    res.status(500).json({ error: 'Error al obtener prospectos CRM.' });
  }
});

app.post('/api/prospects', authenticateToken, async (req, res) => {
  const { id, name, company, contact, phone, email, need, serviceOffered, valueProposed, status, nextStep, followUpDate, notes } = req.body;
  try {
    const exist = await query('SELECT id FROM prospects WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (exist.rows.length > 0) {
      await query(
        `UPDATE prospects SET name = $1, company = $2, contact = $3, phone = $4, email = $5, need = $6, service_offered = $7, 
         value_proposed = $8, status = $9, next_step = $10, follow_up_date = $11, notes = $12 WHERE id = $13 AND user_id = $14`,
        [name, company, contact, phone, email, need, serviceOffered, valueProposed, status, nextStep, followUpDate, notes, id, req.user.id]
      );
    } else {
      await query(
        `INSERT INTO prospects (id, user_id, name, company, contact, phone, email, need, service_offered, value_proposed, status, next_step, follow_up_date, notes) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [id, req.user.id, name, company, contact, phone, email, need, serviceOffered, valueProposed, status, nextStep, followUpDate, notes]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving prospect:', err);
    res.status(500).json({ error: 'Error al guardar prospecto.' });
  }
});

app.delete('/api/prospects/:id', authenticateToken, async (req, res) => {
  try {
    await query('DELETE FROM prospects WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting prospect:', err);
    res.status(500).json({ error: 'Error al eliminar prospecto.' });
  }
});

// --- ROADMAPS ---
app.get('/api/roadmaps', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM roadmaps WHERE user_id = $1 ORDER BY id ASC', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      objectives: row.objectives_json ? JSON.parse(row.objectives_json) : [],
      outcome: row.outcome || '',
      notes: row.notes || ''
    })));
  } catch (err) {
    console.error('Error fetching roadmaps:', err);
    res.status(500).json({ error: 'Error al obtener roadmaps.' });
  }
});

app.post('/api/roadmaps', authenticateToken, async (req, res) => {
  const { id, name, objectives, outcome, notes } = req.body;
  try {
    const exist = await query('SELECT id FROM roadmaps WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    const objectivesJson = JSON.stringify(objectives || []);
    if (exist.rows.length > 0) {
      await query(
        'UPDATE roadmaps SET name = $1, objectives_json = $2, outcome = $3, notes = $4 WHERE id = $5 AND user_id = $6',
        [name, objectivesJson, outcome, notes, id, req.user.id]
      );
    } else {
      await query(
        'INSERT INTO roadmaps (id, user_id, name, objectives_json, outcome, notes) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, req.user.id, name, objectivesJson, outcome, notes]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving roadmap:', err);
    res.status(500).json({ error: 'Error al guardar roadmap.' });
  }
});

// --- WEEKEND PLANS ---
app.get('/api/weekend-plans', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM weekend_plans WHERE user_id = $1', [req.user.id]);
    res.json(result.rows.map(row => ({
      id: row.id,
      saturday: row.saturday_json ? JSON.parse(row.saturday_json) : [],
      sunday: row.sunday_json ? JSON.parse(row.sunday_json) : [],
      reflection: row.reflection_json ? JSON.parse(row.reflection_json) : {
        good: '', improve: '', expenseControl: '', englishAdv: '', projectAdv: '', nextWeekOrg: ''
      }
    })));
  } catch (err) {
    console.error('Error fetching weekend plans:', err);
    res.status(500).json({ error: 'Error al obtener planes de fin de semana.' });
  }
});

app.post('/api/weekend-plans', authenticateToken, async (req, res) => {
  const { id, saturday, sunday, reflection } = req.body;
  try {
    const exist = await query('SELECT id FROM weekend_plans WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    const saturdayJson = JSON.stringify(saturday || []);
    const sundayJson = JSON.stringify(sunday || []);
    const reflectionJson = JSON.stringify(reflection || {});
    if (exist.rows.length > 0) {
      await query(
        'UPDATE weekend_plans SET saturday_json = $1, sunday_json = $2, reflection_json = $3 WHERE id = $4 AND user_id = $5',
        [saturdayJson, sundayJson, reflectionJson, id, req.user.id]
      );
    } else {
      await query(
        'INSERT INTO weekend_plans (id, user_id, saturday_json, sunday_json, reflection_json) VALUES ($1, $2, $3, $4, $5)',
        [id, req.user.id, saturdayJson, sundayJson, reflectionJson]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving weekend plan:', err);
    res.status(500).json({ error: 'Error al guardar plan de fin de semana.' });
  }
});

// --- SERVING STATIC VITE BUILD IN PRODUCTION ---
const distPath = pathModule.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback index.html for SPA router
app.get('/{*splat}', (req, res) => {
  res.sendFile(pathModule.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
