const express = require("express");
const os = require("os");
const { register, metricsMiddleware } = require("./metrics");
const { logger, requestLogger } = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.0.0";

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de métriques (doit être AVANT les routes)
app.use(metricsMiddleware);

// Middleware de logging (doit être AVANT les routes)
app.use(requestLogger);

// Route principale - Hello DevOps
app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.json({
    message: "🚀 Hello DevOps!",
    version: VERSION,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Route health check (indispensable en production)
app.get("/health", (req, res) => {
  const healthData = {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: {
      used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
    },
  };

  logger.debug("Health check performed", healthData);
  res.status(200).json(healthData);
});

// Route pour les métriques Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Route pour les infos système (utile pour le monitoring)
app.get("/info", (req, res) => {
  const info = {
    hostname: os.hostname(),
    platform: os.platform(),
    nodeVersion: process.version,
    memory: {
      total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      free: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(
        2
      )} GB`,
    },
    cpus: os.cpus().length,
  };

  logger.debug("System info requested", info);
  res.json(info);
});

// Route pour tester les erreurs (important pour les tests)
app.get("/error", (req, res) => {
  logger.error("Test error endpoint accessed");
  res.status(500).json({
    error: "Ceci est une erreur de test",
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  logger.warn("Route not found", { path: req.path });
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
  });
});

// Démarrer le serveur seulement si ce fichier est exécuté directement
// (pas quand il est importé pour les tests)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`✅ Serveur démarré`, {
      port: PORT,
      version: VERSION,
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    });
  });
}

// Exporter l'app pour les tests
module.exports = app;
