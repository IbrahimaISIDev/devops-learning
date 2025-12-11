// ================================
// Metrics - Prometheus Integration
// ================================
// Ce fichier configure les métriques Prometheus

const promClient = require('prom-client');

// Créer un registre pour nos métriques
const register = new promClient.Registry();

// Ajouter les métriques système par défaut (CPU, RAM, etc.)
promClient.collectDefaultMetrics({ register });

// ============================================
// MÉTRIQUES PERSONNALISÉES
// ============================================

// 1. COUNTER : Compteur de requêtes HTTP
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// 2. HISTOGRAM : Temps de réponse des requêtes
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
  registers: [register]
});

// 3. GAUGE : Nombre de requêtes en cours
const httpRequestsInProgress = new promClient.Gauge({
  name: 'http_requests_in_progress',
  help: 'Nombre de requêtes HTTP en cours de traitement',
  registers: [register]
});

// 4. COUNTER : Nombre d'erreurs
const httpErrorsTotal = new promClient.Counter({
  name: 'http_errors_total',
  help: 'Nombre total d\'erreurs HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// ============================================
// MIDDLEWARE POUR CAPTURER LES MÉTRIQUES
// ============================================
const metricsMiddleware = (req, res, next) => {
  // Incrémenter le nombre de requêtes en cours
  httpRequestsInProgress.inc();
  
  // Capturer le temps de début
  const start = Date.now();
  
  // Intercepter la fin de la réponse
  res.on('finish', () => {
    // Décrémenter le nombre de requêtes en cours
    httpRequestsInProgress.dec();
    
    // Calculer la durée
    const duration = (Date.now() - start) / 1000; // en secondes
    
    // Labels pour identifier la requête
    const labels = {
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    };
    
    // Enregistrer les métriques
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
    
    // Si erreur (status >= 400), incrémenter le compteur d'erreurs
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });
  
  next();
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  register,
  metricsMiddleware,
  // Exporter aussi les métriques individuelles si besoin
  httpRequestsTotal,
  httpRequestDuration,
  httpRequestsInProgress,
  httpErrorsTotal
};
