module.exports = {
  friendlyName: 'Get One Incube',
  description: 'Get a single incube by ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Incube found.'
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
