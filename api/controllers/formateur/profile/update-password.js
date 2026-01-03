module.exports = {
  friendlyName: 'Update Password',
  description: 'Update the password of the logged-in Formateur.',

  inputs: {
    currentPassword: {
      type: 'string',
      required: true
    },
    newPassword: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Password updated successfully.'
    },
    badCombo: {
      description: 'Incorrect current password.',
      responseType: 'unauthorized'
    }
  },

  fn: async function ({ currentPassword, newPassword }) {
    const bcrypt = require('bcryptjs');
    const formateur = await Formateur.findOne({ id: this.req.me.id });

    if (!formateur) { throw 'badCombo'; }

    const passwordsMatch = await bcrypt.compare(currentPassword, formateur.password);
    if (!passwordsMatch) { throw 'badCombo'; }

    try {
      await sails.helpers.utils.validatePassword(newPassword, 'formateur');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await Formateur.updateOne({ id: this.req.me.id }).set({ password: hashedNewPassword });

    // Notify formateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'formateur',
      app: 'ci',
      title: 'Mot de passe modifié',
      content: 'Votre mot de passe a été modifié avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Error sending update password notification:', err));

    return { message: 'Mot de passe mis à jour avec succès' };
  }
};
