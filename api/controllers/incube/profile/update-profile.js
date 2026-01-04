module.exports = {
  friendlyName: 'Mettre à jour le profil',
  description: 'Mettre à jour le profil de l\'incubé connecté.',

  inputs: {
    nom: {
      type: 'string'
    },
    prenom: {
      type: 'string'
    },
    telephone: {
      type: 'string'
    },
    photoUrl: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Profil mis à jour avec succès.'
    }
  },

  fn: async function ({ nom, prenom, telephone, photoUrl }) {
    const updatedIncube = await Incube.updateOne({ id: this.req.me.id })
      .set({
        nom: nom || undefined,
        prenom: prenom || undefined,
        telephone: telephone || undefined,
        photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl
      });

    // Notifier l'incubé
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'incube',
      app: 'ci',
      title: 'Profil mis à jour',
      content: 'Vos informations de profil ont été mises à jour avec succès.',
      priority: 'low',
      isForAdmin: false
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour du profil :', err));

    return {
      message: 'Profil mis à jour avec succès',
      user: updatedIncube
    };
  }
};
