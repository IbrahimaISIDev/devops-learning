# ================================
# Dockerfile Version 2 : OPTIMISÉ
# ================================
# Cette version utilise le cache Docker intelligemment

FROM node:18-alpine

# Métadonnées (optionnel mais professionnel)
LABEL maintainer="Ibrahima Dev <ibrahimadev6@gmail.com>"
LABEL description="API Hello DevOps - Projet d'apprentissage"
LABEL version="1.0.0"

WORKDIR /app

# 🔑 OPTIMISATION 1 : Copier package.json EN PREMIER
# Pourquoi ? Docker met en cache chaque étape (layer)
# Si package.json ne change pas, il réutilise le cache
# et ne réinstalle PAS les dépendances
COPY package*.json ./

# Installer les dépendances
# Cette étape est mise en cache tant que package.json ne change pas
RUN npm install --production

# 🔑 OPTIMISATION 2 : Copier le code APRÈS
# Le code change souvent, mais les dépendances rarement
# Donc on les installe avant pour profiter du cache
COPY . .

# Port de l'application
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage
CMD ["npm", "start"]

# 📊 RÉSULTAT :
# Si tu modifies juste server.js :
# - Docker réutilise le cache jusqu'à "COPY . ."
# - Il ne réinstalle PAS npm (gain de temps énorme !)
