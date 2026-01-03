module.exports = {
  friendlyName: 'Update Profile',
  description: 'Update the profile of the logged-in Formateur.',

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
      description: 'Profile updated successfully.'
    }
  },

  fn: async function ({ nom, prenom, telephone, photoUrl, specialite }) {
    let formattedPhone;
    if (telephone) {
      try {
        formattedPhone = await sails.helpers.utils.formatPhoneNumber(telephone);
      } catch (err) {
        if (err.code === 'invalidFormat') {
          throw {
            badRequest: 'Le format du numéro de téléphone est invalide. Attendu: +22901xxxxxxxx ou 01xxxxxxxx'
          };
        }
        throw err;
      }
    }

    const updatedFormateur = await Formateur.updateOne({ id: this.req.me.id })
      .set({
        nom: nom || undefined,
        prenom: prenom || undefined,
        telephone: formattedPhone || undefined,
        photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl,
        specialite: specialite || undefined
      });

    // Notify formateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'formateur',
      app: 'ci',
      title: 'Profil mis à jour',
      content: 'Vos informations de profil ont été mises à jour avec succès.',
      priority: 'low',
      isForAdmin: false
    }).catch(err => sails.log.error('Error sending update profile notification:', err));

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
