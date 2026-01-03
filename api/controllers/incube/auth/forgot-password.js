module.exports = {
  friendlyName: 'Forgot Password',
  description: 'Initiate password reset process.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },
  exits: {
    success: {
      description: 'If email exists, reset link sent.'
    }
  },

  fn: async function ({ email }) {
    const crypto = require('crypto');
    const incube = await Incube.findOne({ email: email.toLowerCase() });

    if (!incube) {
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

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
          resetLink: `${appUrls}/auth/reset-password?token=${passwordResetToken}`,
          expirationDelay: '1 heure'
        }
      });
    } catch (error) {
      sails.log.error('Failed to send password reset email:', error);
    }

    return;
  }
};
