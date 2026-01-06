module.exports = {
  friendlyName: 'Mot de passe oublié',
  description: 'Initier le processus de réinitialisation de mot de passe.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },
  exits: {
    success: {
      description: 'Si l\'email existe, un lien de réinitialisation est envoyé.'
    }
  },

  fn: async function ({ email }) {
    const crypto = require('crypto');
    const incube = await Incube.findOne({ email: email.toLowerCase() });

    if (!incube) {
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 heure

    await Incube.updateOne({ id: incube.id }).set({
      passwordResetToken,
      passwordResetTokenExpiresAt
    });

    try {
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'incube/forgot-password',
        to: email,
        subject: 'Réinitialisation de mot de passe - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: incube.prenom,
          resetLink: `${appUrls}/auth/reset-password-incube?token=${passwordResetToken}`,
          expirationDelay: '1 heure'
        }
      });
    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email de réinitialisation de mot de passe :', error);
    }

    return;
  }
};
