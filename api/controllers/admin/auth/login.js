module.exports = {
  friendlyName: 'Login',
  description: 'Log in as Admin.',

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
    accountNotActive: {
      description: 'The account is not active.',
      statusCode: 403
    }
  },
  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Find the admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    if (admin.status !== 'active') {
      throw { accountNotActive: { message: 'Votre compte est inactif.' } };
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, admin.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Generate JWT
    const token = await sails.helpers.generateJwt({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Return token and user data (excluding password)
    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        role: admin.role,
        status: admin.status,
        photoUrl: admin.photoUrl
      }
    };
  }
};
