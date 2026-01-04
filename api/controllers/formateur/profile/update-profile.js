module.exports = {
  friendlyName: 'Mettre à jour le profil',
  description: 'Mettre à jour le profil du formateur connecté.',

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
    },
    specialite: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Profil mis à jour avec succès.'
    }
  },

  fn: async function ({ nom, prenom, telephone, photoUrl, specialite }) {
    const updatedFormateur = await Formateur.updateOne({ id: this.req.me.id })
      .set({
        nom: nom || undefined,
        prenom: prenom || undefined,
        telephone: telephone || undefined,
        photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl,
        specialite: specialite || undefined
      });

    // Notifier le formateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'formateur',
      app: 'ci',
      title: 'Profil mis à jour',
      content: 'Vos informations de profil ont été mises à jour avec succès.',
      priority: 'low',
      isForAdmin: false
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification de mise à jour de profil :', err));

    return {
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedFormateur.id,
        email: updatedFormateur.email,
        nom: updatedFormateur.nom,
        prenom: updatedFormateur.prenom,
        telephone: updatedFormateur.telephone,
        photoUrl: updatedFormateur.photoUrl,
        specialite: updatedFormateur.specialite,
        role: updatedFormateur.role,
        status: updatedFormateur.status
      }
    };
  }
};
