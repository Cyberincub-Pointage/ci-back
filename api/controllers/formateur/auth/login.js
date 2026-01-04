module.exports = {
  friendlyName: 'Connexion formateur',
  description: 'Se connecter en tant que Formateur.',

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
    },
    accountSuspended: {
      description: 'Le compte a été suspendu.',
      statusCode: 403
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');

    // Trouver le formateur par email
    const formateur = await Formateur.findOne({ email: email.toLowerCase() });

    if (!formateur) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Vérifier le mot de passe
    const passwordsMatch = await bcrypt.compare(password, formateur.password);

    if (!passwordsMatch) {
      throw { badCombo: { message: 'Email ou mot de passe incorrect.' } };
    }

    // Vérifier le statut
    if (formateur.status === 'suspended') {
      throw { accountSuspended: { message: 'Votre compte a été suspendu. Contactez l\'administrateur.' } };
    }

    // Générer le JWT
    const token = await sails.helpers.generateJwt({
      id: formateur.id,
      email: formateur.email,
      role: formateur.role
    });

    // Retourner le jeton et les données utilisateur
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
