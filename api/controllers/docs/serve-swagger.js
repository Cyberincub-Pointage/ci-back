module.exports = {


  friendlyName: 'Serve Swagger',


  description: 'Serve the swagger.json file.',


  inputs: {},


  exits: {
    success: {
      // Default response
    },
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

    // Parse to ensure it's valid JSON
    const json = JSON.parse(content);

    // Set headers manually
    this.res.set('Content-Type', 'application/json');
    return json;
  }


};
