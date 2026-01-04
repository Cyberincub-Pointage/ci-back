module.exports = {
  friendlyName: 'Mettre à jour le profil',
  description: 'Mettre à jour le profil de l\'administrateur connecté.',

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
    const updatedAdmin = await Admin.updateOne({ id: this.req.me.id })
      .set({
        nom: nom || undefined,
        prenom: prenom || undefined,
        telephone: telephone || undefined,
        photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl
      });

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Profil mis à jour',
      content: 'Vos informations de profil ont été mises à jour avec succès.',
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour de profil :', err));

    return {
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        nom: updatedAdmin.nom,
        prenom: updatedAdmin.prenom,
        telephone: updatedAdmin.telephone,
        role: updatedAdmin.role,
        status: updatedAdmin.status,
        photoUrl: updatedAdmin.photoUrl
      }
    };
  }
};
