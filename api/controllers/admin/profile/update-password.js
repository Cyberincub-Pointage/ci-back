module.exports = {
  friendlyName: 'Mettre à jour le mot de passe',
  description: 'Mettre à jour le mot de passe de l\'administrateur connecté.',

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
      description: 'Mot de passe mis à jour avec succès.'
    },
    badCombo: {
      description: 'Mot de passe actuel incorrect.',
      responseType: 'unauthorized'
    }
  },

  fn: async function ({ currentPassword, newPassword }) {
    const bcrypt = require('bcryptjs');
    const admin = await Admin.findOne({ id: this.req.me.id });

    if (!admin) { throw 'badCombo'; }

    const passwordsMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!passwordsMatch) { throw 'badCombo'; }

    await Admin.updateOne({ id: this.req.me.id }).set({ password: newPassword });

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Mot de passe modifié',
      content: 'Votre mot de passe a été modifié avec succès.',
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour de mot de passe :', err));

    return { message: 'Mot de passe mis à jour avec succès' };
  }
};
