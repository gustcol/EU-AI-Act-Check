import { t, type Dictionary } from 'intlayer';

/**
 * Error messages translations
 * Error codes and user-facing error messages
 */
const errorsContent = {
  key: 'errors',
  content: {
    notFound: t({
      en: 'Resource not found',
      pt: 'Recurso não encontrado',
      es: 'Recurso no encontrado',
      de: 'Ressource nicht gefunden',
      fr: 'Ressource non trouvée',
      it: 'Risorsa non trovata',
    }),
    unauthorized: t({
      en: 'Unauthorized access',
      pt: 'Acesso não autorizado',
      es: 'Acceso no autorizado',
      de: 'Nicht autorisierter Zugriff',
      fr: 'Accès non autorisé',
      it: 'Accesso non autorizzato',
    }),
    forbidden: t({
      en: 'Access forbidden',
      pt: 'Acesso proibido',
      es: 'Acceso prohibido',
      de: 'Zugriff verboten',
      fr: 'Accès interdit',
      it: 'Accesso vietato',
    }),
    badRequest: t({
      en: 'Invalid request',
      pt: 'Requisição inválida',
      es: 'Solicitud inválida',
      de: 'Ungültige Anfrage',
      fr: 'Requête invalide',
      it: 'Richiesta non valida',
    }),
    serverError: t({
      en: 'Internal server error',
      pt: 'Erro interno do servidor',
      es: 'Error interno del servidor',
      de: 'Interner Serverfehler',
      fr: 'Erreur interne du serveur',
      it: 'Errore interno del server',
    }),
    validationError: t({
      en: 'Validation error',
      pt: 'Erro de validação',
      es: 'Error de validación',
      de: 'Validierungsfehler',
      fr: 'Erreur de validation',
      it: 'Errore di validazione',
    }),
    sessionExpired: t({
      en: 'Session expired, please login again',
      pt: 'Sessão expirada, faça login novamente',
      es: 'Sesión expirada, por favor inicie sesión nuevamente',
      de: 'Sitzung abgelaufen, bitte melden Sie sich erneut an',
      fr: 'Session expirée, veuillez vous reconnecter',
      it: 'Sessione scaduta, effettua nuovamente il login',
    }),
    networkError: t({
      en: 'Network error. Please check your connection.',
      pt: 'Erro de rede. Verifique sua conexão.',
      es: 'Error de red. Por favor verifique su conexión.',
      de: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.',
      fr: 'Erreur réseau. Veuillez vérifier votre connexion.',
      it: 'Errore di rete. Controlla la tua connessione.',
    }),
  },
} satisfies Dictionary;

export default errorsContent;
