module.exports = {
  friendlyName: 'Historique des montants journaliers',
  description: 'Obtenir l\'historique des ajustements de montants journaliers.',

  inputs: {},

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
