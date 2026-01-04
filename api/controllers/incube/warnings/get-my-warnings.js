module.exports = {

  friendlyName: 'Obtenir mes avertissements',
  description: 'Obtenir les avertissements pour l\'incubé connecté.',

  inputs: {},

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function (inputs) {
    if (!this.req.me) {
      throw 'forbidden';
    }

    const warnings = await Warning.find({ incube: this.req.me.id })
      .populate('formateur')
      .sort('date DESC');

    return warnings;
  }
};
