module.exports = {
  friendlyName: 'Get Profile',
  description: 'Get the profile of the logged-in Admin.',

  inputs: {},

  exits: {
    success: {
      description: 'Profile retrieved successfully.'
    },
    notFound: {
      description: 'Profile not found.',
      responseType: 'notFound'
    }
  },

  fn: async function () {
    const admin = await Admin.findOne({ id: this.req.me.id });

    if (!admin) {
      throw 'notFound';
    }

    return {
      message: 'Profil récupéré avec succès',
      user: {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        telephone: admin.telephone,
        role: admin.role,
        status: admin.status,
        photoUrl: admin.photoUrl
      }
    };

  }


};
