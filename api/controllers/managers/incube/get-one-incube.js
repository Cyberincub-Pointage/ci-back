module.exports = {
  friendlyName: 'Obtenir un incubé',
  description: 'Obtenir un seul incubé par ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Incubé trouvé.'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id }) {
    const incube = await Incube.findOne({ id })
      .populate('equipe')
      .populate('projet')
      .populate('banque')
      .populate('pendingBanque')
      .populate('pendingEquipe');


    if (!incube) {
      throw 'notFound';
    }

    return incube;
  }
};
