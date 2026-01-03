module.exports = {
  friendlyName: 'Get My Retro Requests',
  description: 'Get retro presence requests for the currently logged-in incube.',

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
