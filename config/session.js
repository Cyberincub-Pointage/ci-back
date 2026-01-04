const { createClient } = require('redis');


const RedisStore = require('connect-redis').RedisStore;

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({
  url: redisUrl
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().catch(console.error);

const store = new RedisStore({
  client: redisClient,
  prefix: 'ci_sess:',
});


module.exports.session = {
  secret: process.env.SESSION_SECRET,
  store: store,

  // isSessionDisabled: function (req){
  //   return !!req.path.match(req._sails.LOOKS_LIKE_ASSET_RX);
  // },

};
