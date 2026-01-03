module.exports = {
  friendlyName: 'Forgot Password',
  description: 'Initiate password reset process for Formateur.',

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
    const formateur = await Formateur.findOne({ email: email.toLowerCase() });

    if (!formateur) {
      return;
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    await Formateur.updateOne({ id: formateur.id }).set({
      passwordResetToken: passwordResetToken, // Note: Formateur model might need these fields too if not present. Confirmed in step 7 they are likely missing.
      // Step 7 file view of Formateur.js did NOT show passwordResetToken fields. Only invitationToken.
      // I need to update Formateur model as well.
      passwordResetTokenExpiresAt
    });

    // Defer writing to file until I can verify/update Formateur model. 
    // Actually I'll write the file and then update the model immediately.

    try {
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'formateur/forgot-password',
        to: email,
        subject: 'Réinitialisation de mot de passe - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: formateur.prenom,
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
