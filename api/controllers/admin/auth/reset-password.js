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
        if (err.message.includes('validatePassword') || err.message.includes('Le mot de passe')) {
          let cleanMsg = '';

          if (err.message.includes("Additional data: '")) {
            const parts = err.message.split("Additional data: '");
            if (parts[1]) {
              cleanMsg = parts[1].split("'")[0];
            }
          }

          if (!cleanMsg && err.message.includes('Le mot de passe doit contenir')) {
            cleanMsg = 'Le mot de passe doit contenir au moins 12 caractères, avec 2 majuscules, 2 minuscules, 2 chiffres et 2 caractères spéciaux.';
          }

          if (cleanMsg) {
            throw { passwordFormatInvalid: cleanMsg };
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

    // Notifier admin
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
