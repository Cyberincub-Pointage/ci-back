module.exports = {
  friendlyName: 'Montant journalier',
  description: 'Définir le montant de paiement journalier de présence, effectif à partir d\'une date spécifique.',

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
      throw { badRequest: 'Format de date invalide. Utilisez AAAA-MM-JJ.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (inputs.effectiveDate < today) {
      throw { badRequest: 'La date effective ne peut pas être dans le passé.' };
    }

    // Vérifier si un enregistrement existe déjà pour cette date exacte ?
    const existing = await DailyAmount.findOne({ effectiveDate: inputs.effectiveDate });

    if (existing) {
      await DailyAmount.updateOne({ id: existing.id }).set({
        amount: inputs.amount,
        createdBy: this.req.me.id
      });


      // Notifier l'Administrateur
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Montant journalier mis à jour',
        content: `Le montant journalier pour le ${inputs.effectiveDate} a été mis à jour à ${inputs.amount}.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

      return { message: 'Montant journalier mis à jour pour cette date effective.', data: existing };
    } else {
      const newRecord = await DailyAmount.create({
        amount: inputs.amount,
        effectiveDate: inputs.effectiveDate,
        createdBy: this.req.me.id
      }).fetch();
      return { message: 'Montant journalier programmé.', data: newRecord };
    }
  }
};
