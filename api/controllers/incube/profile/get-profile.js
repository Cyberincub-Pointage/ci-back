module.exports = {
  friendlyName: 'Get Profile',
  description: 'Get the profile of the logged-in Incube.',

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
    const incube = await Incube.findOne({ id: this.req.me.id })
      .populate('equipe')
      .populate('projet')
      .populate('banque')
      .populate('pendingBanque')
      .populate('pendingEquipe');

    if (!incube) {
      throw 'notFound';
    }

    return {
      message: 'Profil récupéré avec succès',
      user: {
        id: incube.id,
        email: incube.email,
        nom: incube.nom,
        prenom: incube.prenom,
        telephone: incube.telephone,
        role: incube.role,
        photoUrl: incube.photoUrl,
        status: incube.status,
        rib: incube.rib,
        equipe: incube.equipe,
        projet: incube.projet,
        banque: incube.banque,
        pendingRib: incube.pendingRib,
        pendingBanque: incube.pendingBanque,
        pendingEquipe: incube.pendingEquipe,
      }
    };
  }
};
