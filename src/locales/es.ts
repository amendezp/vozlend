import type { Locale } from "./en";

export const es: Locale = {
  hero: {
    badge: "Evaluaci\u00f3n Crediticia por Voz con IA",
    headline: "Tu voz es tu",
    headlineHighlight: "solicitud de pr\u00e9stamo",
    description:
      "Sube un memo de voz en espa\u00f1ol describiendo tu solicitud de pr\u00e9stamo. Echo Bank transcribe, analiza y eval\u00faa tu solicitud usando IA \u2014 entregando una decisi\u00f3n completa en menos de un minuto.",
    trustSpeed: "Resultados en ~30 segundos",
    trustSecure: "Seguro y confidencial",
    trustVoice: "Memos de voz en espa\u00f1ol",
  },
  howItWorks: {
    title: "C\u00f3mo Funciona",
    subtitle: "Tres simples pasos de memo de voz a decisi\u00f3n crediticia",
    step1Title: "Grabar",
    step1Desc:
      "Graba un memo de voz describiendo tu solicitud de pr\u00e9stamo \u2014 qui\u00e9n eres, cu\u00e1nto necesitas y c\u00f3mo planeas pagar.",
    step2Title: "Analizar",
    step2Desc:
      "Nuestra IA transcribe tu voz, extrae datos clave y realiza un an\u00e1lisis crediticio integral en 8 dimensiones.",
    step3Title: "Decisi\u00f3n",
    step3Desc:
      "Recibe un reporte detallado con tu puntaje, decisi\u00f3n (aprobar, rechazar o m\u00e1s info necesaria) y t\u00e9rminos espec\u00edficos o pr\u00f3ximos pasos.",
  },
  footer: {
    tagline:
      "Echo Bank \u2014 Evaluaci\u00f3n crediticia por voz con IA para pr\u00e9stamos alternativos.",
    builtWith:
      "Construido con OpenAI Whisper, GPT-4o y Next.js. Desplegado en Vercel.",
  },
  upload: {
    tabUpload: "Subir Archivo",
    tabRecord: "Grabar",
    dropActive: "Suelta tu memo de voz aqu\u00ed",
    dropIdle: "Suelta tu memo de voz aqu\u00ed o haz clic para buscar",
    formats: "Formatos: opus, ogg, mp3, m4a, wav, webm (m\u00e1x 25MB)",
    invalidFile:
      "Archivo inv\u00e1lido. Sube un archivo de audio (opus, ogg, mp3, m4a, wav, webm).",
    fileTooLarge: "Archivo muy grande ({size}MB). M\u00e1ximo: 25MB",
    remove: "Eliminar",
    analyzeButton: "Analizar Memo de Voz",
  },
  recorder: {
    startRecording: "Iniciar Grabaci\u00f3n",
    stopRecording: "Detener Grabaci\u00f3n",
    useRecording: "Usar Esta Grabaci\u00f3n",
    reRecord: "Volver a Grabar",
    micDenied:
      "Acceso al micr\u00f3fono denegado. Permite el acceso al micr\u00f3fono en la configuraci\u00f3n de tu navegador.",
    httpsRequired:
      "La grabaci\u00f3n requiere una conexi\u00f3n segura (HTTPS).",
    recording: "Grabando...",
  },
  processing: {
    analyzing: "Analizando Tu Solicitud...",
    complete: "\u00a1An\u00e1lisis Completo!",
    error: "Error de Procesamiento",
    stepUploading: "Subiendo",
    stepTranscribing: "Transcribiendo",
    stepExtracting: "Extrayendo Datos",
    stepUnderwriting: "Evaluando Cr\u00e9dito",
    reportReady: "\u00a1Reporte listo! Redirigiendo...",
    preparing: "Preparando subida...",
    reportReadyShort: "\u00a1Reporte listo!",
  },
  report: {
    back: "Volver",
    brand: "Echo Bank",
    analyzeAnother: "Analizar Otro",
    downloadPdf: "Descargar PDF",
    notFoundTitle: "Reporte No Encontrado",
    notFoundDesc:
      "Este reporte puede haber expirado o el enlace es inv\u00e1lido.",
    backToHome: "Volver al Inicio",
    reportId: "ID del Reporte",
    generated: "Generado",
    footerBrand: "Echo Bank \u2014 Evaluaci\u00f3n Crediticia por Voz con IA",
  },
  reportHeader: {
    approved: "Aprobado",
    declined: "Rechazado",
    moreInfo: "Se Necesita M\u00e1s Informaci\u00f3n",
    applicant: "Solicitante",
    amountNotSpecified: "Monto No Especificado",
    weightedScore: "Puntaje Ponderado",
  },
  scoreCard: {
    title: "Tarjeta de Puntaje",
    weighted: "Ponderado",
  },
  scoreDimensions: {
    education_institutional_quality: "Educaci\u00f3n y Calidad Institucional",
    professional_network_social_capital: "Red Profesional y Capital Social",
    character_communication_quality: "Car\u00e1cter y Calidad de Comunicaci\u00f3n",
    income_stability_earning_potential:
      "Estabilidad de Ingresos y Potencial de Ganancia",
    collateral_asset_base: "Garant\u00edas y Base de Activos",
    debt_to_income_ratio: "Relaci\u00f3n Deuda-Ingreso",
    purpose_alignment: "Alineaci\u00f3n del Prop\u00f3sito",
    repayment_plan_credibility: "Credibilidad del Plan de Pago",
  },
  extractedData: {
    title: "Datos de la Solicitud",
    subtitle: "Extra\u00eddos del memo de voz",
    sectionApplicant: "Solicitante",
    sectionLoan: "Solicitud de Pr\u00e9stamo",
    sectionRepayment: "Plan de Pago",
    sectionAdditional: "Contexto Adicional",
    labelName: "Nombre",
    labelOccupation: "Ocupaci\u00f3n",
    labelInstitution: "Instituci\u00f3n",
    labelProgram: "Programa",
    labelLocation: "Ubicaci\u00f3n",
    labelPrevEmployers: "Empleadores Anteriores",
    labelPrevRoles: "Roles Anteriores",
    labelAmount: "Monto",
    labelPurpose: "Prop\u00f3sito",
    labelDetails: "Detalles",
    labelStrategy: "Estrategia",
    labelIncomeSource: "Fuente de Ingresos",
    labelTimeline: "Plazo",
    labelProspectiveEmployers: "Empleadores Potenciales",
    labelCreditSituation: "Situaci\u00f3n Crediticia",
    labelNotes: "Notas",
  },
  decisionTerms: {
    approvedTerms: "T\u00e9rminos Aprobados",
    declineReasons: "Razones del Rechazo",
    infoRequested: "Informaci\u00f3n Solicitada",
    approvedAmount: "Monto Aprobado",
    interestRate: "Tasa de Inter\u00e9s",
    loanTerm: "Plazo del Pr\u00e9stamo",
    conditions: "Condiciones",
    moreInfoDesc:
      "Necesitamos m\u00e1s informaci\u00f3n para tomar una decisi\u00f3n. Por favor proporciona respuestas a:",
  },
  analysis: {
    title: "An\u00e1lisis Detallado",
  },
  stressTest: {
    forcedTitle: "Prueba de Estr\u00e9s: Decisi\u00f3n Forzada",
    altTitle: "Prueba de Estr\u00e9s: Escenario Alternativo",
    forcedDesc:
      "Si se forzara una decisi\u00f3n binaria sin informaci\u00f3n adicional:",
    approveAltDesc: "Si esta solicitud fuera forzada a ser rechazada:",
    declineAltDesc: "Si esta solicitud fuera forzada a ser aprobada:",
    forcedApproval: "Aprobaci\u00f3n Forzada",
    forcedDecline: "Rechazo Forzado",
    amount: "Monto",
    rate: "Tasa",
    term: "Plazo",
  },
  transcription: {
    title: "Transcripci\u00f3n Original",
    language: "Idioma",
    duration: "Duraci\u00f3n",
  },
};
