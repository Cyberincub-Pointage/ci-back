module.exports = {
  friendlyName: 'Get Daily Amount History',
  description: 'Get the history of daily amount adjustments.',

  inputs: {
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function () {
    const history = await DailyAmount.find()
      .sort('effectiveDate DESC')
      .populate('createdBy');

    return history;
  }
};
