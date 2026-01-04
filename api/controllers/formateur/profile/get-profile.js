module.exports = {
  friendlyName: 'Obtenir le profil',
  description: 'Obtenir le profil du formateur connecté.',

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
