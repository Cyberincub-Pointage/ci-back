module.exports = {
  friendlyName: 'Request Retro Presence',
  description: 'Incube requests a retroactive presence for a past date.',

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
      description: 'Request already exists for this date.'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (inputs.date !== yesterday) { }

    try {
      // Check existing request
      const existing = await RetroPresenceRequest.findOne({
        incube: incubeId,
        date: inputs.date,
        status: { '!=': 'rejected' }
      });

      if (existing) {
        sails.log.debug(`RetroPresence: Request already exists for ${incubeId} on ${inputs.date}`);
        throw 'alreadyExists';
      }

      // Check if presence actually exists already
      const existingPresence = await Presence.findOne({
        incube: incubeId,
        date: inputs.date,
        status: 'validated'
      });

      if (existingPresence) {
        sails.log.debug(`RetroPresence: Validated presence already exists for ${incubeId} on ${inputs.date}`);
        throw { badRequest: 'Une présence validée existe déjà pour cette date.' };
      }

      const request = await RetroPresenceRequest.create({
        incube: incubeId,
        date: inputs.date,
        motif: inputs.motif,
        status: 'pending',
        validatedAt: null
      }).fetch();

      sails.log.info(`RetroPresence: Created request ${request.id}`);

      // Notify incubé
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
        sails.log.error('Error sending retro request notification:', err);
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
