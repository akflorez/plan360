import { Transaction, Habit, CalendarEvent, FocusPlan, FocusPlanSession, Prospect, MonthlyRoadmap, WeekendPlan, UserSettings } from '../types';

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

export const defaultFocusPlans: FocusPlan[] = [
  {
    id: "fp-gym",
    name: "Gimnasio & Fitness",
    icon: "Dumbbell",
    color: "emerald",
    target: 4,
    unit: "sesiones",
    timeframeType: "months",
    timeframeValue: "6",
    createdAt: "2026-05-01"
  },
  {
    id: "fp-english",
    name: "Estudio de Inglés",
    icon: "Languages",
    color: "purple",
    target: 5,
    unit: "horas",
    timeframeType: "months",
    timeframeValue: "6",
    createdAt: "2026-05-01"
  },
  {
    id: "fp-running",
    name: "Correr (Running)",
    icon: "Zap",
    color: "blue",
    target: 20,
    unit: "km",
    timeframeType: "months",
    timeframeValue: "3",
    createdAt: "2026-05-01"
  }
];

export const defaultFocusSessions: FocusPlanSession[] = [
  {
    id: "fs-en-1",
    planId: "fp-english",
    date: "2026-05-19",
    value: 1, // 60 min
    details: "Listening (Power BI Case Studies)",
    notes: "Escuché podcast de analítica. Muy bueno para aprender cómo presentan métricas los profesionales."
  },
  {
    id: "fs-en-2",
    planId: "fp-english",
    date: "2026-05-20",
    value: 1, // 60 min
    details: "Business English (Email Templates)",
    notes: "Redacté correos profesionales para enviar propuestas de proyectos de BI."
  },
  {
    id: "fs-en-3",
    planId: "fp-english",
    date: "2026-05-22",
    value: 1, // 60 min
    details: "Speaking (Self Introduction)",
    notes: "Practiqué frente al espejo cómo presentarme y explicar mi rol como Directora de Analítica."
  },
  {
    id: "fs-en-4",
    planId: "fp-english",
    date: "2026-05-23",
    value: 1.5, // 90 min
    details: "Reading (DAX Optimization)",
    notes: "Lectura técnica en inglés sobre optimización de queries y carga de datos."
  },
  {
    id: "fs-en-5",
    planId: "fp-english",
    date: "2026-05-24",
    value: 1, // 60 min
    details: "Grammar (Conditionals)",
    notes: "Ejercicios prácticos aplicando condicionales a negociaciones financieras."
  },
  {
    id: "fs-en-6",
    planId: "fp-english",
    date: "2026-05-25",
    value: 1, // 60 min
    details: "Vocabulary (KPIs Finanzas)",
    notes: "Aprendí términos como EBITDA, Gross Profit, Operating Expenses, Burn Rate."
  },
  {
    id: "fs-w-1",
    planId: "fp-gym",
    date: "2026-05-19",
    value: 1,
    details: "Rutina Pierna",
    notes: "Sentadillas libres: 4x10 (60kg), Prensa inclinada: 4x12 (120kg), Zancadas: 3x12. Fuerza alta."
  },
  {
    id: "fs-w-2",
    planId: "fp-gym",
    date: "2026-05-21",
    value: 1,
    details: "Rutina Brazos",
    notes: "Bíceps alternado con mancuerna, Tríceps copa. Buen bombeo de brazos."
  },
  {
    id: "fs-w-3",
    planId: "fp-gym",
    date: "2026-05-24",
    value: 1,
    details: "Rutina Core",
    notes: "Plancha frontal: 3x1 min, Abdominales crunch con disco: 4x20. Foco en estabilidad."
  },
  {
    id: "fs-w-4",
    planId: "fp-gym",
    date: "2026-05-25",
    value: 1,
    details: "Full Body",
    notes: "Peso muerto rumano: 4x10, Press banca: 4x12. Entrenamiento completo pre-semanal."
  },
  {
    id: "fs-r-1",
    planId: "fp-running",
    date: "2026-05-20",
    value: 5,
    details: "Running Suave",
    notes: "Parque El Virrey. Clima templado ideal, rodaje para soltar piernas."
  },
  {
    id: "fs-r-2",
    planId: "fp-running",
    date: "2026-05-23",
    value: 12,
    details: "Fondo Largo",
    notes: "Tirada larga del sábado. Hidratación con electrolitos. Un poco cansada en km 9."
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
