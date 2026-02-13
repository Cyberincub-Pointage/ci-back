const { createClient } = require('redis');
const RedisStore = require('connect-redis').RedisStore;

const redisUrl = process.env.REDIS_URL;

// Configuration de session par défaut (sans Redis / store en mémoire)
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
};

// Tenter la connexion Redis seulement si REDIS_URL est défini
if (redisUrl) {
  try {
    const redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,       // Timeout de connexion : 5s
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('⚠️  Redis : trop de tentatives, fallback sur session en mémoire.');
            return false; // Arrêter les tentatives de reconnexion
          }
          return Math.min(retries * 500, 3000);
        }
      }
    });

    redisClient.on('error', (err) => {
      console.log('⚠️  Redis Client Error:', err.message);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connecté avec succès.');
    });

    redisClient.connect().then(() => {
      const store = new RedisStore({
        client: redisClient,
        prefix: 'ci_sess:',
      });
      sessionConfig.store = store;
      console.log('✅ Session store : Redis');
    }).catch((err) => {
      console.log('⚠️  Redis indisponible, utilisation du store en mémoire.', err.message);
    });
  } catch (err) {
    console.log('⚠️  Erreur config Redis, utilisation du store en mémoire.', err.message);
  }
} else {
  console.log('ℹ️  REDIS_URL non défini, utilisation du store session en mémoire.');
}

module.exports.session = sessionConfig;
