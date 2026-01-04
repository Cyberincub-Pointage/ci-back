module.exports = {
  friendlyName: 'Servir Swagger',
  description: 'Servir le fichier swagger.json.',

  inputs: {},

  exits: {
    success: {},
    notFound: { statusCode: 404 }
  },


  fn: async function (inputs) {
    const fs = require('fs');
    const path = require('path');
    const swaggerPath = path.resolve(sails.config.appPath, 'swagger', 'swagger.json');

    if (!fs.existsSync(swaggerPath)) {
      throw 'notFound';
    }

    const content = fs.readFileSync(swaggerPath, 'utf8');

    // S'assurer que c'est un JSON valide
    const json = JSON.parse(content);

    // Définir les en-têtes
    this.res.set('Content-Type', 'application/json');
    return json;
  }


};
