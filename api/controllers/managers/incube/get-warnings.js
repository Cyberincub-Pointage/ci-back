module.exports = {

  friendlyName: 'Obtenir les avertissements',
  description: 'Obtenir les avertissements créés par le formateur connecté.',

  inputs: {
    incubeId: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function (inputs) {
    if (!this.req.me) {
      throw 'forbidden';
    }

    let criteria = {};
    if (inputs.incubeId) {
      criteria.incube = inputs.incubeId;
    } else {
      criteria.formateur = this.req.me.id;
    }

    const warnings = await Warning.find(criteria)
      .populate('incube')
      .sort('date DESC');

    return warnings;
  }
};
