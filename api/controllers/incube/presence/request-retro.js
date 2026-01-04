module.exports = {
  friendlyName: 'Demander une présence rétro',
  description: 'L\'incubé demande une présence rétroactive pour une date passée.',

  inputs: {
    date: {
      type: 'string',
      required: true
    },
    motif: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    badRequest: {
      responseType: 'badRequest'
    },
    alreadyExists: {
      statusCode: 409,
      description: 'Une demande existe déjà pour cette date.'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (inputs.date !== yesterday) { }

    try {
      // Vérifier la demande existante
      const existing = await RetroPresenceRequest.findOne({
        incube: incubeId,
        date: inputs.date,
        status: { '!=': 'rejected' }
      });

      if (existing) {
        sails.log.debug(`RetroPresence : Demande existante pour ${incubeId} le ${inputs.date}`);
        throw 'alreadyExists';
      }

      // Vérifier si la présence existe déjà
      const existingPresence = await Presence.findOne({
        incube: incubeId,
        date: inputs.date,
        status: 'validated'
      });

      if (existingPresence) {
        sails.log.debug(`RetroPresence : Présence validée existante pour ${incubeId} le ${inputs.date}`);
        throw { badRequest: 'Une présence validée existe déjà pour cette date.' };
      }

      const request = await RetroPresenceRequest.create({
        incube: incubeId,
        date: inputs.date,
        motif: inputs.motif,
        status: 'pending',
        validatedAt: null
      }).fetch();

      sails.log.info(`RetroPresence : Demande créée ${request.id}`);

      // Notifier l'incubé
      try {
        await sails.helpers.sender.notification.with({
          recipientId: incubeId,
          model: 'incube',
          app: 'ci',
          title: 'Demande rétro enregistrée',
          content: `Votre demande de régularisation pour le ${inputs.date} a été enregistrée.`,
          priority: 'normal',
          isForAdmin: false
        });
      } catch (err) {
        sails.log.error('Erreur lors de l\'envoi de la notification de demande rétro :', err);
      }

      return request;

    } catch (err) {
      // Pass through known exits
      if (err === 'alreadyExists' || err.badRequest) {
        throw err;
      }

      // Check for specific database errors (like string length)
      if (err.code === 'E_VALIDATION') {
        throw { badRequest: 'Données invalides (vérifiez la longueur du motif).' };
      }

      throw { badRequest: 'Une erreur interne est survenue lors du traitement de votre demande.' };
    }
  }
};
