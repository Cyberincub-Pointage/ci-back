module.exports = {
  friendlyName: 'Get Profile',
  description: 'Get the profile of the logged-in Formateur.',

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
    const formateur = await Formateur.findOne({ id: this.req.me.id })
      .populate('equipes');

    if (!formateur) {
      throw 'notFound';
    }

    return {
      message: 'Profil récupéré avec succès',
      user: {
        id: formateur.id,
        email: formateur.email,
        nom: formateur.nom,
        prenom: formateur.prenom,
        telephone: formateur.telephone,
        role: formateur.role,
        status: formateur.status,
        specialite: formateur.specialite,
        photoUrl: formateur.photoUrl,
        equipes: formateur.equipes
      }
    };
  }
};
