require('dotenv').config();

module.exports.security = {

  cors: {
    allRoutes: true,
    allowOrigins: process.env.NODE_ENV === 'production'
      ? [
        'https://cyberincub.com',
        'https://www.cyberincub.com',
        'https://cyberincub.netlify.app',
        'https://cyberincub-staging.netlify.app'
      ]
      : [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000'
      ],
    allowCredentials: true,
    allowAnyOriginWithCredentialsUnsafe: false,
    allowRequestHeaders: 'Content-Type, Authorization, X-Requested-With, x-api-key',
    allowResponseHeaders: 'Content-Type, Authorization, Location, Set-Cookie',
    allowRequestMethods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
  },

  // csrf: false

};
