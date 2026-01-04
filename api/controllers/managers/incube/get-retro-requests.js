module.exports = {
  friendlyName: 'Obtenir les demandes rétro',
  description: 'Obtenir les demandes de présence rétroactive, optionnellement filtrées.',

  inputs: {
    incubeId: {
      type: 'string'
    },
    status: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function (inputs) {
    let criteria = {
      status: { '!=': 'validated' }
    };

    if (inputs.incubeId) {
      criteria.incube = inputs.incubeId;
    }

    if (inputs.status) {
      criteria.status = inputs.status;
    }

    const requests = await RetroPresenceRequest.find(criteria)
      .populate('incube')
      .sort('createdAt DESC');

    return requests;
  }
};
