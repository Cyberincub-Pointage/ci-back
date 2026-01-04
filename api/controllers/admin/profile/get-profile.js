module.exports = {
  friendlyName: 'Obtenir le profil',
  description: 'Obtenir le profil de l\'administrateur connecté.',

  inputs: {},

  exits: {
    success: {
      description: 'Profil récupéré avec succès.'
    },
    notFound: {
      description: 'Profil non trouvé.',
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
