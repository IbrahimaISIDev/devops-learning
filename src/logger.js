// ================================
// Logger - Winston Configuration
// ================================
// Logging structuré et professionnel

const winston = require('winston');

// Format personnalisé pour les logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Configuration du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { 
    service: 'hello-devops',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console output (pour développement)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      )
    }),
    
    // Fichier pour toutes les erreurs
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: customFormat
    }),
    
    // Fichier pour tous les logs
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: customFormat
    })
  ]
});

// Si on n'est pas en production, on log aussi en debug
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

// ============================================
// MIDDLEWARE EXPRESS POUR LOGGER LES REQUÊTES
// ============================================
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    // Log en fonction du status code
    if (res.statusCode >= 500) {
      logger.error('Server Error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Client Error', logData);
    } else {
      logger.info('Request', logData);
    }
  });
  
  next();
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  logger,
  requestLogger
};
