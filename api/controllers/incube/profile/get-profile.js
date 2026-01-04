module.exports = {
  friendlyName: 'Obtenir le profil',
  description: 'Obtenir le profil de l\'incubé connecté.',

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
