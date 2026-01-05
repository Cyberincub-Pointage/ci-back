# 1️⃣ Image officielle Node.js
FROM node:18

# 2️⃣ Définit le répertoire de travail dans le container
WORKDIR /app

# 3️⃣ Copie uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

# 4️⃣ Installe les dépendances
RUN npm install --production

# 5️⃣ Copie tout le reste du projet
COPY . .

# 6️⃣ Expose le port attendu par Back4App
ENV PORT=1337
EXPOSE 1337

# 7️⃣ Commande de démarrage adaptée à Sails.js
CMD ["node", "app.js"]
