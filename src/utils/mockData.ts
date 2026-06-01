import { Transaction, Habit, CalendarEvent, EnglishSession, WorkoutSession, RunningSession, Prospect, MonthlyRoadmap, WeekendPlan, UserSettings } from '../types';

export const defaultSettings: UserSettings = {
  username: "Kari",
  currency: "COP",
  extraIncomeGoal: 4000000,
  dailyEnglishGoal: 1, // 1 hora
  weeklyGymGoal: 4, // 4 sesiones
  weeklyRunningGoal: 20, // 20 km
  monthlyBudget: 3500000,
  customCategories: [
    "Salario", "Ingreso extra", "Alimentación", "Transporte", "Vivienda", 
    "Servicios", "Salud", "Gym", "Running", "Ropa", "Ocio", "Familia", 
    "Deudas", "Ahorro", "Educación", "Proyecto digital", "Otros"
  ],
  theme: 'femenino',
  profilePic: '', // No profile pic uploaded by default
  subscriptionPlan: 'Pro',
  subscriptionRenewal: '2026-11-30',
  subscriptionStatus: 'Activa'
};

export const defaultTransactions: Transaction[] = [
  {
    id: "tx-1",
    date: "2026-05-01",
    type: "ingreso",
    category: "Salario",
    description: "Pago salario mensual principal",
    amount: 6000000,
    paymentMethod: "Transferencia bancaria",
    status: "pagado"
  },
  {
    id: "tx-2",
    date: "2026-05-15",
    type: "ingreso",
    category: "Ingreso extra",
    description: "Anticipo Dashboard Power BI Ventas",
    amount: 1200000,
    paymentMethod: "Transferencia bancaria",
    status: "pagado"
  },
  {
    id: "tx-3",
    date: "2026-05-02",
    type: "egreso fijo",
    category: "Vivienda",
    description: "Arriendo apartamento y administración",
    amount: 1800000,
    paymentMethod: "Débito automático",
    status: "pagado"
  },
  {
    id: "tx-4",
    date: "2026-05-03",
    type: "egreso fijo",
    category: "Servicios",
    description: "Internet, luz y agua",
    amount: 420000,
    paymentMethod: "PSE",
    status: "pagado"
  },
  {
    id: "tx-5",
    date: "2026-05-05",
    type: "egreso fijo",
    category: "Gym",
    description: "Mensualidad gimnasio",
    amount: 120000,
    paymentMethod: "Tarjeta de crédito",
    status: "pagado"
  },
  {
    id: "tx-6",
    date: "2026-05-08",
    type: "egreso variable",
    category: "Alimentación",
    description: "Mercado quincenal en supermercado",
    amount: 550000,
    paymentMethod: "Tarjeta de débito",
    status: "pagado"
  },
  {
    id: "tx-7",
    date: "2026-05-10",
    type: "egreso variable",
    category: "Transporte",
    description: "Gasolina y peajes",
    amount: 220000,
    paymentMethod: "Efectivo",
    status: "pagado"
  },
  {
    id: "tx-8",
    date: "2026-05-12",
    type: "egreso variable",
    category: "Ocio",
    description: "Cena con amigas",
    amount: 150000,
    paymentMethod: "Tarjeta de crédito",
    status: "pagado"
  },
  {
    id: "tx-9",
    date: "2026-05-04",
    type: "egreso fijo",
    category: "Proyecto digital",
    description: "Hosting Web y Licencia Power BI Pro",
    amount: 85000,
    paymentMethod: "Tarjeta de crédito",
    status: "pagado"
  },
  {
    id: "tx-10",
    date: "2026-05-18",
    type: "egreso variable",
    category: "Educación",
    description: "Libro de inglés y gramática avanzada",
    amount: 90000,
    paymentMethod: "Tarjeta de débito",
    status: "pagado"
  },
  {
    id: "tx-11",
    date: "2026-05-28",
    type: "egreso variable",
    category: "Alimentación",
    description: "Mercado quincenal proyectado",
    amount: 450000,
    paymentMethod: "Tarjeta de débito",
    status: "proyectado"
  },
  {
    id: "tx-12",
    date: "2026-05-29",
    type: "egreso variable",
    category: "Otros",
    description: "Regalo de cumpleaños previsto",
    amount: 150000,
    paymentMethod: "Efectivo",
    status: "pendiente"
  }
];

export const defaultHabits: Habit[] = [
  {
    id: "h-1",
    name: "Inglés 1 hora",
    frequency: "diario",
    target: 60,
    unit: "minutos",
    logs: {
      "2026-05-19": { done: true, comment: "Estudié listening en la mañana" },
      "2026-05-20": { done: true, comment: "Vocabulario de negocios" },
      "2026-05-21": { done: false, comment: "Día muy ocupado en el trabajo" },
      "2026-05-22": { done: true, comment: "Speaking con audio" },
      "2026-05-23": { done: true, comment: "Lectura de artículo técnico" },
      "2026-05-24": { done: true, comment: "Gramática condicionales" },
      "2026-05-25": { done: true, comment: "Preparación de glosario" }
    }
  },
  {
    id: "h-2",
    name: "Gym",
    frequency: "diario",
    target: 1,
    unit: "veces",
    logs: {
      "2026-05-19": { done: true, comment: "Rutina de pierna exigente" },
      "2026-05-20": { done: false },
      "2026-05-21": { done: true, comment: "Tren superior brazos/hombros" },
      "2026-05-22": { done: false },
      "2026-05-23": { done: false, comment: "Descanso activo" },
      "2026-05-24": { done: true, comment: "Rutina core y espalda" },
      "2026-05-25": { done: true, comment: "Full body" }
    }
  },
  {
    id: "h-3",
    name: "Running",
    frequency: "semanal",
    target: 3,
    unit: "veces",
    logs: {
      "2026-05-20": { done: true, comment: "5km de running suave en parque" },
      "2026-05-23": { done: true, comment: "12km de fondo el sábado" },
      "2026-05-25": { done: false }
    }
  },
  {
    id: "h-4",
    name: "Registrar gastos",
    frequency: "diario",
    target: 1,
    unit: "veces",
    logs: {
      "2026-05-19": { done: true },
      "2026-05-20": { done: true },
      "2026-05-21": { done: true },
      "2026-05-22": { done: true },
      "2026-05-23": { done: false, comment: "Se me olvidó, lo hago hoy" },
      "2026-05-24": { done: true, comment: "Registré lo del finde" },
      "2026-05-25": { done: true }
    }
  },
  {
    id: "h-5",
    name: "Proyecto $4M",
    frequency: "diario",
    target: 1,
    unit: "veces",
    logs: {
      "2026-05-19": { done: true, comment: "Búsqueda de leads en LinkedIn" },
      "2026-05-20": { done: true, comment: "Estructuré la oferta comercial" },
      "2026-05-21": { done: false },
      "2026-05-22": { done: true, comment: "Creación de portafolio en Power BI" },
      "2026-05-23": { done: false },
      "2026-05-24": { done: false },
      "2026-05-25": { done: true, comment: "Contacté 2 prospectos" }
    }
  }
];

export const defaultEvents: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Entrenamiento Gym - Pierna",
    date: "2026-05-26",
    time: "06:30",
    activityType: "gym",
    description: "Día de enfoque en tren inferior y fuerza.",
    status: "pendiente"
  },
  {
    id: "ev-2",
    title: "Estudiar Inglés - Negociación",
    date: "2026-05-26",
    time: "08:00",
    activityType: "inglés",
    description: "Vocabulario clave para reuniones de venta de dashboards.",
    status: "pendiente"
  },
  {
    id: "ev-3",
    title: "Reunión Andrea Restrepo (Logística)",
    date: "2026-05-27",
    time: "15:00",
    activityType: "proyecto $4m",
    description: "Presentación de propuesta técnica de analítica de despachos.",
    status: "pendiente"
  },
  {
    id: "ev-4",
    title: "Running de Tempo - 7km",
    date: "2026-05-28",
    time: "18:00",
    activityType: "running",
    description: "Controlar ritmo constante de 5:15 min/km.",
    status: "pendiente"
  },
  {
    id: "ev-5",
    title: "Revisión Financiera Quincenal",
    date: "2026-05-29",
    time: "19:00",
    activityType: "finanzas",
    description: "Ajustar proyección de fin de mes y registrar egresos pendientes.",
    status: "pendiente"
  },
  {
    id: "ev-6",
    title: "Running de Fondo - 14km",
    date: "2026-05-30",
    time: "07:00",
    activityType: "running",
    description: "Fondo del fin de semana por ruta de montaña.",
    status: "pendiente"
  },
  {
    id: "ev-7",
    title: "Comida con Familia",
    date: "2026-05-31",
    time: "13:00",
    activityType: "familia",
    description: "Almuerzo familiar domingo.",
    status: "pendiente"
  }
];

export const defaultEnglishSessions: EnglishSession[] = [
  {
    id: "en-1",
    date: "2026-05-19",
    minutes: 60,
    practiceType: "Listening",
    topic: "Power BI Analyst Case Studies",
    difficulty: "Medio",
    notes: "Escuché podcast de analítica. Muy bueno para aprender cómo presentan métricas los profesionales."
  },
  {
    id: "en-2",
    date: "2026-05-20",
    minutes: 60,
    practiceType: "Business English",
    topic: "Email Templates for Client Proposals",
    difficulty: "Fácil",
    notes: "Redacté correos profesionales para enviar propuestas de proyectos de BI."
  },
  {
    id: "en-3",
    date: "2026-05-22",
    minutes: 60,
    practiceType: "Speaking",
    topic: "Self Introduction & Services pitch",
    difficulty: "Difícil",
    notes: "Practiqué frente al espejo cómo presentarme y explicar mi rol como Directora de Analítica de Datos."
  },
  {
    id: "en-4",
    date: "2026-05-23",
    minutes: 90,
    practiceType: "Reading",
    topic: "Documentation on DAX Optimization",
    difficulty: "Medio",
    notes: "Lectura técnica en inglés sobre optimización de queries y carga de datos."
  },
  {
    id: "en-5",
    date: "2026-05-24",
    minutes: 60,
    practiceType: "Grammar",
    topic: "First and Second Conditionals in Business",
    difficulty: "Medio",
    notes: "Ejercicios prácticos aplicando condicionales a negociaciones financieras."
  },
  {
    id: "en-6",
    date: "2026-05-25",
    minutes: 60,
    practiceType: "Vocabulary",
    topic: "Finance & Accounting KPIs",
    difficulty: "Fácil",
    notes: "Aprendí términos como: EBITDA, Gross Profit, Operating Expenses, Burn Rate."
  }
];

export const defaultWorkoutSessions: WorkoutSession[] = [
  {
    id: "w-1",
    date: "2026-05-19",
    type: "Pierna",
    duration: 60,
    intensity: "Alta",
    exercises: "Sentadillas libres: 4x10 (60kg)\nPrensa inclinada: 4x12 (120kg)\nZancadas con mancuerna: 3x12\nExtensión de piernas: 3x15",
    notes: "Excelente entreno, mucha fuerza en las piernas hoy.",
    energyLevel: 5
  },
  {
    id: "w-2",
    date: "2026-05-21",
    type: "Brazos",
    duration: 50,
    intensity: "Media",
    exercises: "Bíceps alternado con mancuerna: 4x12\nTríceps copa a dos manos: 4x12\nCurl de bíceps en polea: 3x15\nExtensión de tríceps polea alta: 3x15",
    notes: "Buen bombeo de brazos, cansancio ligero de hombros por el trabajo.",
    energyLevel: 4
  },
  {
    id: "w-3",
    date: "2026-05-24",
    type: "Core",
    duration: 45,
    intensity: "Media",
    exercises: "Plancha frontal: 3x1 min\nAbdominales crunch con disco: 4x20\nElevación de piernas colgada: 4x12\nGiros rusos: 3x30",
    notes: "Foco en estabilidad. Un poco perezosa al inicio pero logré completarlo.",
    energyLevel: 3
  },
  {
    id: "w-4",
    date: "2026-05-25",
    type: "Full body",
    duration: 65,
    intensity: "Alta",
    exercises: "Peso muerto rumano: 4x10\nPress banca con mancuernas: 4x12\nRemo con barra: 4x10\nPress militar con barra: 3x12",
    notes: "Entrenamiento completo pre-semanal. Buena respuesta cardiovascular.",
    energyLevel: 4
  }
];

export const defaultRunningSessions: RunningSession[] = [
  {
    id: "r-1",
    date: "2026-05-20",
    distance: 5,
    time: "00:27:30",
    pace: "5:30 min/km",
    type: "Suave",
    sensations: "Frescura total, rodaje para soltar piernas.",
    notes: "Parque El Virrey. Clima templado ideal."
  },
  {
    id: "r-2",
    date: "2026-05-23",
    distance: 12,
    time: "01:08:24",
    pace: "5:42 min/km",
    type: "Fondo",
    sensations: "Cansancio al km 9, pero mentalmente fuerte para terminar.",
    notes: "Tirada larga del sábado. Hidratación con electrolitos."
  }
];

export const defaultProspects: Prospect[] = [
  {
    id: "p-1",
    name: "Carlos Gómez",
    company: "Inversiones del Café S.A.",
    contact: "Carlos Gómez (Gerente General)",
    phone: "+57 311 456 7890",
    email: "carlos.gomez@cafesa.co",
    need: "Visualizar ventas de múltiples tiendas y exportación en tiempo real.",
    serviceOffered: "Dashboard Comercial Integrado en Power BI",
    valueProposed: 1200000,
    status: "ganado",
    nextStep: "Entrega de accesos y capacitación corta al equipo",
    followUpDate: "2026-05-28",
    notes: "Ya realizó el pago del 50% inicial de $600.000. Excelente cliente y muy receptivo."
  },
  {
    id: "p-2",
    name: "Andrea Restrepo",
    company: "Logística Express",
    contact: "Andrea Restrepo (Dir. Operaciones)",
    phone: "+57 315 987 6543",
    email: "arestrepo@logexpress.co",
    need: "Controlar tiempos de despacho y entregas de conductores en ruta.",
    serviceOffered: "Tablero de Desempeño Logístico + Alertas Automáticas",
    valueProposed: 1800000,
    status: "propuesta",
    nextStep: "Reunión técnica para revisar propuesta comercial enviada",
    followUpDate: "2026-05-27",
    notes: "Envié propuesta el 22 de Mayo. Está muy interesada en el módulo de alertas en tiempo real."
  },
  {
    id: "p-3",
    name: "Mateo Silva",
    company: "Fit Studio Gym",
    contact: "Mateo Silva (Propietario)",
    phone: "+57 300 123 4567",
    email: "mateo@fitstudio.co",
    need: "Consolidar ingresos de membresías, gastos de instructores y flujos de caja.",
    serviceOffered: "Dashboard de Finanzas para Centros de Acondicionamiento",
    valueProposed: 1500000,
    status: "contactado",
    nextStep: "Agendar reunión virtual exploratoria para levantar requerimientos",
    followUpDate: "2026-05-29",
    notes: "Contacto inicial por recomendación de un amigo común. Mostró interés en automatizar su excel."
  },
  {
    id: "p-4",
    name: "Valentina Muñoz",
    company: "Moda Local Boutique",
    contact: "Valentina Muñoz (Creadora)",
    phone: "+57 312 333 4455",
    email: "valen@modalocal.com",
    need: "Dashboard de inventarios integrado con ventas de Shopify.",
    serviceOffered: "Dashboard Shopify Analytics + Conector Automatizado",
    valueProposed: 1600000,
    status: "prospecto",
    nextStep: "Enviar portafolio con ejemplos similares e intro comercial",
    followUpDate: "2026-06-01",
    notes: "Conocí su caso por un post en LinkedIn. Le vendría muy bien ordenar su inventario."
  }
];

export const defaultRoadmaps: MonthlyRoadmap[] = [
  {
    id: 1,
    name: "Mes 1: Bases y Estructura",
    objectives: [
      { id: "obj-1-1", text: "Orden financiero: registrar todos los gastos y definir presupuesto", done: true },
      { id: "obj-1-2", text: "Crear rutina de inglés: bloquear 1 hora diaria de estudio", done: true },
      { id: "obj-1-3", text: "Definir oferta comercial: empaquetar servicios de Power BI", done: false },
      { id: "obj-1-4", text: "Crear 3 dashboards demo de portafolio (Ventas, Finanzas, Logística)", done: false },
      { id: "obj-1-5", text: "Crear lista de 15 prospectos calificados para empezar a contactar", done: false }
    ],
    outcome: "Rutinas de inglés y finanzas bien asentadas. Aún falta terminar el portafolio demo para salir a vender con mayor seguridad.",
    notes: "Priorizar la finalización del portafolio comercial y el diseño de la oferta estándar esta semana."
  },
  {
    id: 2,
    name: "Mes 2: Lanzamiento Comercial",
    objectives: [
      { id: "obj-2-1", text: "Contactar mínimo 10 prospectos por semana en frío/cálido", done: false },
      { id: "obj-2-2", text: "Publicar 2 contenidos semanales sobre datos y Power BI en LinkedIn", done: false },
      { id: "obj-2-3", text: "Realizar las primeras 5 reuniones de diagnóstico comercial", done: false },
      { id: "obj-2-4", text: "Mejorar inglés laboral enfocado en reuniones y correos electrónicos", done: false }
    ],
    outcome: "",
    notes: ""
  },
  {
    id: 3,
    name: "Mes 3: Primeras Conversiones",
    objectives: [
      { id: "obj-3-1", text: "Conseguir las primeras 2 ventas efectivas de dashboards", done: false },
      { id: "obj-3-2", text: "Practicar conversación diaria en inglés (Speaking focus)", done: false },
      { id: "obj-3-3", text: "Ajustar propuesta comercial según feedback de reuniones previas", done: false }
    ],
    outcome: "",
    notes: ""
  },
  {
    id: 4,
    name: "Mes 4: Sistematización y Proceso",
    objectives: [
      { id: "obj-4-1", text: "Sistematizar el servicio (crear templates de diseño y ETL rápidos)", done: false },
      { id: "obj-4-2", text: "Crear plantillas de correos y entregables de proyectos", done: false },
      { id: "obj-4-3", text: "Pedir referidos a los primeros clientes ganados", done: false },
      { id: "obj-4-4", text: "Fortalecer inglés aplicado a ventas y negociación directa", done: false }
    ],
    outcome: "",
    notes: ""
  },
  {
    id: 5,
    name: "Mes 5: Escalamiento",
    objectives: [
      { id: "obj-5-1", text: "Escalar ventas: buscar cerrar 3 o 4 clientes en el mes", done: false },
      { id: "obj-5-2", text: "Crear producto digital o plantilla monetizable de Power BI", done: false },
      { id: "obj-5-3", text: "Mejorar portafolio agregando casos de éxito reales", done: false },
      { id: "obj-5-4", text: "Practicar presentación de proyectos y dashboards en inglés", done: false }
    ],
    outcome: "",
    notes: ""
  },
  {
    id: 6,
    name: "Mes 6: Consolidación",
    objectives: [
      { id: "obj-6-1", text: "Llegar o superar los $4.000.000 COP en ingresos extra mensuales", done: false },
      { id: "obj-6-2", text: "Consolidar clientes recurrentes con planes de soporte", done: false },
      { id: "obj-6-3", text: "Tener portafolio 100% bilingüe y perfil internacional listo", done: false },
      { id: "obj-6-4", text: "Evaluar siguiente etapa de crecimiento o escalamiento del negocio", done: false }
    ],
    outcome: "",
    notes: ""
  }
];

export const defaultWeekendPlans: WeekendPlan[] = [
  {
    id: "2026-21",
    saturday: [
      { id: "sat-1", text: "Running de Fondo largo - 12k", done: true },
      { id: "sat-2", text: "Estudiar inglés 1 hora (Lectura técnica)", done: true },
      { id: "sat-3", text: "Almorzar con familia y descansar", done: true }
    ],
    sunday: [
      { id: "sun-1", text: "Organizar las finanzas del hogar de la quincena", done: true },
      { id: "sun-2", text: "Preparar agenda de la semana entrante", done: true },
      { id: "sun-3", text: "Tener tarde de relax / Película", done: true }
    ],
    reflection: {
      good: "Completé mi tirada larga de running a buen ritmo y cumplí las metas de estudio del fin de semana.",
      improve: "Comer a deshoras el domingo afectó un poco mi sueño por la noche.",
      expenseControl: "El almuerzo familiar del sábado costó un poco más de lo presupuestado. Debo regular salidas a comer.",
      englishAdv: "Aprendí nuevos conceptos sobre optimización DAX leyendo documentación en inglés.",
      projectAdv: "Estructuré mi portafolio de dashboards para presentar a clientes.",
      nextWeekOrg: "Agendar y confirmar citas con prospectos el lunes temprano."
    }
  }
];
