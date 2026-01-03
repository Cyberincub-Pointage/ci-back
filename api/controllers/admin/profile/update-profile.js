module.exports = {
  friendlyName: 'Update Profile',
  description: 'Update the profile of the logged-in Admin.',

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
      description: 'Profile updated successfully.'
    }
  },

  fn: async function ({ nom, prenom, telephone, photoUrl }) {
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

    const updatedAdmin = await Admin.updateOne({ id: this.req.me.id })
      .set({
        nom: nom || undefined,
        prenom: prenom || undefined,
        telephone: formattedPhone || undefined,
        photoUrl: (photoUrl === '' || photoUrl === null) ? '' : photoUrl
      });

    // Notify admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Profil mis à jour',
      content: 'Vos informations de profil ont été mises à jour avec succès.',
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending update profile notification:', err));

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
