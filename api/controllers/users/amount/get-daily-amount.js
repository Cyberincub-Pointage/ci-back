module.exports = {
  friendlyName: 'Obtenir le montant journalier',
  description: 'Obtenir le montant journalier actuellement actif et l\'historique optionnel.',

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

    // Trouver le dernier enregistrement où effectiveDate <= targetDate
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
