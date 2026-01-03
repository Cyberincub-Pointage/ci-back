module.exports = {
  friendlyName: 'Forgot Password',
  description: 'Initiate password reset process for Admin.',

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
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await Admin.updateOne({ id: admin.id }).set({
      passwordResetToken,
      passwordResetTokenExpiresAt
    });

    try {
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'admin/forgot-password',
        to: email,
        subject: 'Réinitialisation de mot de passe Administrateur - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: admin.prenom,
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
