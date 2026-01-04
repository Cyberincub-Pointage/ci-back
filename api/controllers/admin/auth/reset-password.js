module.exports = {
  friendlyName: 'Réinitialiser le mot de passe',
  description: 'Réinitialiser le mot de passe Administrateur en utilisant un jeton valide.',

  inputs: {
    token: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Réinitialisation du mot de passe réussie.'
    },
    invalidToken: {
      description: 'Jeton invalide ou expiré.',
      statusCode: 400
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.'
    }
  },

  fn: async function ({ token, password }) {
    const bcrypt = require('bcryptjs');

    const admin = await Admin.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { '>': Date.now() }
    });

    if (!admin) { throw { invalidToken: 'Jeton invalide ou expiré.' }; }

    try {
      await Admin.updateOne({ id: admin.id }).set({
        password: password,
        passwordResetToken: '',
        passwordResetTokenExpiresAt: 0
      });
    } catch (err) {
      if (err.message) {
        if (err.message.includes('Le mot de passe doit contenir') || (err.invalid && err.invalid.includes('Le mot de passe'))) {
          const msg = err.invalid || err.message;
          if (msg.includes('Le mot de passe doit contenir')) {
            throw { passwordFormatInvalid: msg.includes('Error: ') ? msg.split('Error: ')[1] : msg };
          }
        }
        if (err.raw && err.raw.invalid) {
          throw { passwordFormatInvalid: err.raw.invalid };
        }
      }

      if (err.invalid) {
        throw { passwordFormatInvalid: err.invalid };
      }
      throw err;
    }

    // Notify admin
    await sails.helpers.sender.notification.with({
      recipientId: admin.id,
      model: 'admin',
      app: 'ci',
      title: 'Mot de passe réinitialisé',
      content: 'Votre mot de passe a été réinitialisé avec succès.',
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de réinitialisation de mot de passe :', err));

    return {
      message: 'Mot de passe réinitialisé avec succès'
    };
  }
};
