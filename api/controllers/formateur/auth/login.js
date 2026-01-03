module.exports = {
  friendlyName: 'Login',
  description: 'Log in as Formateur.',

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
    },
    accountSuspended: {
      description: 'The account has been suspended.',
      statusCode: 403
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Find the formateur by email
    const formateur = await Formateur.findOne({ email: email.toLowerCase() });

    if (!formateur) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, formateur.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Check status
    if (formateur.status === 'suspended') {
      throw { accountSuspended: { message: 'Votre compte a été suspendu. Contactez l\'administrateur.' } };
    }

    // Generate JWT
    const token = await sails.helpers.generateJwt({
      id: formateur.id,
      email: formateur.email,
      role: formateur.role
    });

    // Return token and user data
    return {
      token,
      user: {
        id: formateur.id,
        email: formateur.email,
        nom: formateur.nom,
        prenom: formateur.prenom,
        role: formateur.role,
        status: formateur.status
      }
    };
  }
};
