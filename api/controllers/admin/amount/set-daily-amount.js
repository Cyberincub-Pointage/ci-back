module.exports = {
  friendlyName: 'Set Daily Amount',
  description: 'Set the daily presence payment amount, effective from a specific date.',

  inputs: {
    amount: {
      type: 'number',
      required: true,
      min: 0
    },
    effectiveDate: {
      type: 'ref',
      columnType: 'date',
      required: true,
      description: 'YYYY-MM-DD'
    }
  },

  exits: {
    success: { responseType: 'ok' },
    badRequest: { responseType: 'badRequest' }
  },

  fn: async function (inputs) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(inputs.effectiveDate)) {
      throw { badRequest: 'Invalid date format. Use YYYY-MM-DD.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (inputs.effectiveDate < today) {
      throw { badRequest: 'Effective date cannot be in the past.' };
    }

    // Check if a record already exists for this exact date?
    const existing = await DailyAmount.findOne({ effectiveDate: inputs.effectiveDate });

    if (existing) {
      await DailyAmount.updateOne({ id: existing.id }).set({
        amount: inputs.amount,
        createdBy: this.req.me.id
      });


      // Notify Admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Montant journalier mis à jour',
        content: `Le montant journalier pour le ${inputs.effectiveDate} a été mis à jour à ${inputs.amount}.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Error sending admin notification:', err));

      return { message: 'Daily amount updated for this effective date.', data: existing };
    } else {
      const newRecord = await DailyAmount.create({
        amount: inputs.amount,
        effectiveDate: inputs.effectiveDate,
        createdBy: this.req.me.id
      }).fetch();
      return { message: 'Daily amount scheduled.', data: newRecord };
    }
  }
};
