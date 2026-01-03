module.exports = {
  friendlyName: 'Login',
  description: 'Log in using the provided email and password.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Login successful.'
    },
    badCombo: {
      description: 'Invalid email or password.',
      statusCode: 401
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Find the incube by email
    const incube = await Incube.findOne({ email: email.toLowerCase() });

    if (!incube) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, incube.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Generate JWT
    const token = await sails.helpers.generateJwt({
      id: incube.id,
      email: incube.email,
      role: 'incube'
    });

    // Return token and user data
    return {
      token,
      user: {
        id: incube.id,
        email: incube.email,
        nom: incube.nom,
        prenom: incube.prenom,
        role: 'incube',
        status: incube.status
      }
    };
  }
};
