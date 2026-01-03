module.exports = {
  friendlyName: 'Get Daily Amount',
  description: 'Get the currently active daily amount and optional history.',

  inputs: {
    date: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function (inputs) {
    const targetDate = inputs.date || new Date().toISOString().split('T')[0];

    // Find the latest record where effectiveDate <= targetDate
    const currentConfig = await DailyAmount.find({
      effectiveDate: { '<=': targetDate }
    })
      .sort('effectiveDate DESC')
      .limit(1);

    const activeAmount = currentConfig.length > 0 ? currentConfig[0].amount : null;

    return {
      amount: activeAmount,
      effectiveDate: currentConfig.length > 0 ? currentConfig[0].effectiveDate : null,
      targetDate: targetDate
    };
  }
};
