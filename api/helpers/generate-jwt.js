const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Générer un JWT',
  description: 'Générer un JSON Web Token.',
  inputs: {
    payload: {
      type: 'ref',
      required: true
    }
  },
  fn: async function (inputs) {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(inputs.payload, secret, { expiresIn: '7d' });
  }
};
