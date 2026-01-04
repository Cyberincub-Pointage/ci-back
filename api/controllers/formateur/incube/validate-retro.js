module.exports = {
  friendlyName: 'Valider une demande rétro',
  description: 'Le formateur valide ou rejette une demande de présence rétroactive.',

  inputs: {
    requestId: {
      type: 'string',
      required: true
    },
    approved: {
      type: 'boolean',
      required: true
    },
    reason: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs) {
    const formateurId = this.req.me.id;

    const request = await RetroPresenceRequest.findOne({ id: inputs.requestId });
    if (!request) { throw 'notFound'; }

    const updates = {
      status: inputs.approved ? 'validated' : 'rejected',
      validatedBy: formateurId,
      validatedAt: new Date().toISOString()
    };

    if (!inputs.approved && inputs.reason) {
      updates.rejectionReason = inputs.reason;
    }

    await RetroPresenceRequest.updateOne({ id: inputs.requestId }).set(updates);

    // Si approuvé, créer l'enregistrement de présence réel
    if (inputs.approved) {
      const currentConfig = await DailyAmount.find({
        effectiveDate: { '<=': request.date }
      })
        .sort('effectiveDate DESC')
        .limit(1);

      const amount = currentConfig.length > 0 ? currentConfig[0].amount : null;

      await Presence.create({
        incube: request.incube,
        date: request.date,
        heureArrivee: '09:00:00',
        status: 'validated',
        isGeolocValid: false,
        validatedBy: formateurId,
        validatedAt: new Date().toISOString(),
        amount: amount,
        isRetro: true
      });
    }

    // Notifier l'incubé
    try {
      await sails.helpers.sender.notification.with({
        recipientId: request.incube,
        model: 'incube',
        app: 'ci',
        title: inputs.approved ? 'Demande rétro validée' : 'Demande rétro rejetée',
        content: inputs.approved
          ? `Votre demande de régularisation pour le ${request.date} a été validée.`
          : `Votre demande de régularisation pour le ${request.date} a été rejetée.${inputs.reason ? ' Motif: ' + inputs.reason : ''}`,
        priority: 'high',
        isForAdmin: false
      });
    } catch (err) {
      sails.log.error('Erreur lors de l\'envoi de la notification de validation rétro :', err);
    }

    return { success: true };
  }
};
