require('dotenv').config();

module.exports['swagger-generator'] = {
  disabled: false,
  swaggerJsonPath: './swagger/swagger.json',
  swagger: {
    openapi: '3.0.0',
    info: {
      title: 'CyberIncub Pointage API',
      description: 'API documentation for CI Pointage',
      version: '1.0.0',
      contact: {
        name: 'CyberIncub Support',
        email: 'contact@cyberincub.bj',
        url: 'https://cyberincub.io'
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:1337/',
        description: 'Development server',
      },
      {
        url: process.env.CI_API_URL,
        description: 'Live server',
      },
    ],
    externalDocs: {
      description: 'Documentation et endpoints CyberIncub Pointage',
      url: 'http://localhost:1337'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          in: 'header',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ BearerAuth: [] }]
  },
  defaults: {
    responses: {
      '200': { description: 'Succès' },
      '400': { description: 'Requête invalide' },
      '401': { description: 'Non autorisé' },
      '403': { description: 'Accès interdit' },
      '404': { description: 'Ressource non trouvée' },
      '409': { description: 'Conflit' },
      '429': { description: 'Trop de requêtes' },
      '500': { description: 'Erreur interne du serveur' }
    }
  }
};
