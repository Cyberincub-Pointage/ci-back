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
      statusCode: 401
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.'
    }
  },

  fn: async function ({ currentPassword, newPassword }) {
    const bcrypt = require('bcryptjs');
    const admin = await Admin.findOne({ id: this.req.me.id });

    if (!admin) { throw { badCombo: 'Utilisateur introuvable.' }; }

    const passwordsMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!passwordsMatch) { throw { badCombo: 'Mot de passe actuel incorrect.' }; }

    try {
      await Admin.updateOne({ id: this.req.me.id }).set({ password: newPassword });
    } catch (err) {
      if (err.message) {
        if (err.message.includes('Le mot de passe doit contenir') || (err.invalid && err.invalid.includes('Le mot de passe'))) {
          const msg = err.invalid || err.message;
          if (msg.includes('Le mot de passe doit contenir')) {
            throw { passwordFormatInvalid: msg.includes('Error: ') ? msg.split('Error: ')[1] : msg };
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
