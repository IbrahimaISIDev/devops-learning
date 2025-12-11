const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.0.0";

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de logging basique
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Route principale - Hello DevOps
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Hello DevOps - Version 2.0! Je souhaite m'initier au DevOps.",
    version: VERSION,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Route health check (indispensable en production)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Route pour les infos système (utile pour le monitoring)
app.get("/info", (req, res) => {
  res.json({
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
  });
});

// Route pour obtenir la version
app.get("/version", (req, res) => {
  res.json({
    version: VERSION,
    name: "hello-devops",
    timestamp: new Date().toISOString(),
  });
});

// Route pour tester les erreurs (important pour les tests)
app.get("/error", (req, res) => {
  res.status(500).json({
    error: "Ceci est une erreur de test",
    timestamp: new Date().toISOString(),
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.path,
  });
});

// Démarrer le serveur seulement si ce fichier est exécuté directement
// (pas quand il est importé pour les tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
    console.log(`📝 Version: ${VERSION}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

// Exporter l'app pour les tests
module.exports = app;
