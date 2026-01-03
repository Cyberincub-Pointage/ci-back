module.exports = {
  friendlyName: 'Update Password',
  description: 'Update the password of the logged-in Incube.',

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
    const incube = await Incube.findOne({ id: this.req.me.id });

    if (!incube) { throw 'badCombo'; }

    const passwordsMatch = await bcrypt.compare(currentPassword, incube.password);
    if (!passwordsMatch) { throw 'badCombo'; }

    try {
      await sails.helpers.utils.validatePassword(newPassword, 'incube');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await Incube.updateOne({ id: this.req.me.id }).set({ password: hashedNewPassword });

    // Notify incubé
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'incube',
      app: 'ci',
      title: 'Mot de passe modifié',
      content: 'Votre mot de passe a été modifié avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Error sending update password notification:', err));

    return { message: 'Mot de passe mis à jour avec succès' };
  }
};
