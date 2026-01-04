module.exports = {
  friendlyName: 'Mettre à jour le mot de passe',
  description: 'Mettre à jour le mot de passe du formateur connecté.',

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
    const formateur = await Formateur.findOne({ id: this.req.me.id });

    if (!formateur) { throw 'badCombo'; }

    const passwordsMatch = await bcrypt.compare(currentPassword, formateur.password);
    if (!passwordsMatch) { throw 'badCombo'; }

    await Formateur.updateOne({ id: this.req.me.id }).set({ password: newPassword });

    // Notifier le formateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'formateur',
      app: 'ci',
      title: 'Mot de passe modifié',
      content: 'Votre mot de passe a été modifié avec succès.',
      priority: 'normal',
      isForAdmin: false
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour de mot de passe :', err));

    return { message: 'Mot de passe mis à jour avec succès' };
  }
};
