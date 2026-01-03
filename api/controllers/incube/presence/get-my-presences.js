module.exports = {
  friendlyName: 'Get My Presences',
  description: 'Get presences for the currently logged-in incube.',

  inputs: {
    startDate: { type: 'string' },
    endDate: { type: 'string' }
  },

  exits: {
    success: { responseType: 'ok' }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;
    let criteria = { incube: incubeId };

    if (inputs.startDate && inputs.endDate) {
      criteria.date = { '>=': inputs.startDate, '<=': inputs.endDate };
    } else if (inputs.startDate) {
      criteria.date = { '>=': inputs.startDate };
    }

    const presences = await Presence.find(criteria).sort('date DESC');

    return presences;
  }
};
