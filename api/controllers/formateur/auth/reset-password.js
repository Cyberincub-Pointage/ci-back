module.exports = {
  friendlyName: 'Reset Password',
  description: 'Reset Formateur password using a valid token.',

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
      description: 'Password reset successful.'
    },
    invalidToken: {
      description: 'Invalid or expired token.',
      responseType: 'badRequest'
    }
  },

  fn: async function ({ token, password }) {
    const bcrypt = require('bcryptjs');

    const formateur = await Formateur.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiresAt: { '>': Date.now() }
    });

    if (!formateur) { throw 'invalidToken'; }

    try {
      await sails.helpers.utils.validatePassword(password, 'formateur');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Formateur.updateOne({ id: formateur.id }).set({
      password: hashedPassword,
      passwordResetToken: '',
      passwordResetTokenExpiresAt: 0
    });

    // Notify formateur
    await sails.helpers.sender.notification.with({
      recipientId: formateur.id,
      model: 'formateur',
      app: 'ci',
      title: 'Mot de passe réinitialisé',
      content: 'Votre mot de passe a été réinitialisé avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Error sending reset password notification:', err));

    return {
      message: 'Mot de passe réinitialisé avec succès'
    };
  }
};
