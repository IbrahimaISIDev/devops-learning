![CI Status](https://github.com/IbrahimaISIDev/devops-learning/workflows/CI%20Simple/badge.svg)

# 🚀 Hello DevOps

Une API REST simple pour apprendre et pratiquer le DevOps de A à Z.

## 📋 Description

Ce projet est une application Node.js/Express qui démontre les principes DevOps :
- ✅ Code versionné avec Git
- ✅ Tests automatisés
- ✅ Containerisation avec Docker
- ✅ CI/CD avec GitHub Actions
- ✅ Monitoring et logs

## 🛠️ Technologies

- **Runtime** : Node.js
- **Framework** : Express.js
- **Tests** : Jest + Supertest
- **Containerisation** : Docker (à venir)
- **CI/CD** : GitHub Actions (à venir)

## 🚦 Installation

```bash
# Cloner le projet
git clone [votre-repo]
cd hello-devops

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Lancer en mode production
npm start
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch
```

## 📡 Routes disponibles

| Route | Méthode | Description |
|-------|---------|-------------|
| `/` | GET | Message de bienvenue |
| `/health` | GET | Health check |
| `/info` | GET | Informations système |
| `/error` | GET | Test d'erreur |

## 📊 Exemple de réponse

```json
{
  "message": "🚀 Hello DevOps!",
  "version": "1.0.0",
  "timestamp": "2024-12-09T10:30:00.000Z",
  "environment": "development"
}
```

## 🎯 Objectifs pédagogiques

Ce projet vous permet de comprendre :
1. La structure d'une API REST moderne
2. L'importance des tests automatisés
3. Les principes de l'Intégration Continue
4. La containerisation avec Docker
5. Le déploiement automatisé

## 👨‍💻 Auteur

Ibrahima Dev - Parcours DevOps 2025

## 📝 Licence

MIT
