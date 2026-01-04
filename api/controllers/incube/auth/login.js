module.exports = {
  friendlyName: 'Connexion',
  description: 'Se connecter en utilisant l\'email et le mot de passe fournis.',

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
      description: 'Email ou mot de passe invalide.',
      statusCode: 401
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Trouver l'incubé par email
    const incube = await Incube.findOne({ email: email.toLowerCase() });

    if (!incube) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Vérifier le mot de passe
    const passwordsMatch = await bcrypt.compare(password, incube.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Générer le JWT
    const token = await sails.helpers.generateJwt({
      id: incube.id,
      email: incube.email,
      role: 'incube'
    });

    // Retourner le token et les données utilisateur
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
