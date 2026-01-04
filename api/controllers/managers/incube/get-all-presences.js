module.exports = {
  friendlyName: 'Obtenir toutes les présences',
  description: 'Obtenir toutes les présences, optionnellement filtrées par date, incubé ou statut.',

  inputs: {
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
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
    let criteria = {};

    if (inputs.startDate && inputs.endDate) {
      criteria.date = { '>=': inputs.startDate, '<=': inputs.endDate };
    } else if (inputs.startDate) {
      criteria.date = { '>=': inputs.startDate };
    }

    if (inputs.incubeId) {
      criteria.incube = inputs.incubeId;
    }

    if (inputs.status) {
      criteria.status = inputs.status;
    }

    const presences = await Presence.find(criteria)
      .populate('incube')
      .sort('date DESC');

    return presences;
  }
};
