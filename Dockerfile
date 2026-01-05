# Utilise l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail dans le container
WORKDIR /app

# Copier les fichiers de l'application
COPY . /app

# Installer les dépendances
RUN npm install

# Exposer le port sur lequel l'application Sails.js écoute
EXPOSE 1337

# Définir le port via la variable d'environnement (Back4App injecte PORT)
ENV PORT=1337

# Définir le point d'entrée du container
CMD ["npm", "start"]
