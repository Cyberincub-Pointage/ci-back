module.exports = {

  friendlyName: 'Get my warnings',
  description: 'Get warnings for the logged in incube.',

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
