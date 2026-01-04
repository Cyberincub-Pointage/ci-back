module.exports = {
  friendlyName: 'Obtenir mes demandes rétro',
  description: 'Obtenir les demandes de présence rétroactive pour l\'incubé connecté.',

  inputs: {},

  exits: {
    success: { responseType: 'ok' }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;

    const requests = await RetroPresenceRequest.find({
      incube: incubeId,
      status: { '!=': 'validated' }
    })
      .sort('createdAt DESC');

    return requests;
  }
};
