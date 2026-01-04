module.exports = {
  friendlyName: 'Connexion administrateur',
  description: 'Se connecter en tant qu\'administrateur.',

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
      description: 'Connexion réussie.'
    },
    badCombo: {
      description: 'Email ou mot de passe incorrect.',
      statusCode: 401
    },
    accountNotActive: {
      description: 'Le compte n\'est pas actif.',
      statusCode: 403
    }
  },
  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Trouver l'administrateur par email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    if (admin.status !== 'active') {
      throw { accountNotActive: { message: 'Votre compte est inactif.' } };
    }

    // Vérifier le mot de passe
    const passwordsMatch = await bcrypt.compare(password, admin.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Générer le JWT
    const token = await sails.helpers.generateJwt({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Retourner le jeton et les données utilisateur (sans le mot de passe)
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
