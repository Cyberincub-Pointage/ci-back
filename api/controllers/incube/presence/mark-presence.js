module.exports = {
  friendlyName: 'Marquer la présence',
  description: 'Permettre à un incubé de marquer sa présence pour la journée.',

  inputs: {
    latitude: {
      type: 'number',
      required: true
    },
    longitude: {
      type: 'number',
      required: true
    },
    isGeolocValid: {
      type: 'boolean',
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
      description: 'Présence déjà marquée pour aujourd\'hui.'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    // Vérifier si existe déjà
    const existing = await Presence.findOne({
      incube: incubeId,
      date: today
    });

    if (existing) {
      throw 'alreadyExists';
    }

    // Coordonnées cibles depuis la configuration
    const { latitude: targetLat, longitude: targetLon, radius: allowedRadius } = sails.config.custom.presenceZone;

    const distance = await sails.helpers.geo.getDistance.with({
      lat1: inputs.latitude,
      lon1: inputs.longitude,
      lat2: targetLat,
      lon2: targetLon
    });
    const isInZone = distance <= allowedRadius;

    sails.log.info(`MarkPresence: User ${incubeId} at distance ${distance}m (Allowed: ${allowedRadius}m) -> InZone: ${isInZone}`);

    // Déterminer le montant journalier
    const currentConfig = await DailyAmount.find({
      effectiveDate: { '<=': today }
    })
      .sort('effectiveDate DESC')
      .limit(1);

    const amount = currentConfig.length > 0 ? currentConfig[0].amount : 0;

    const newPresence = await Presence.create({
      incube: incubeId,
      date: today,
      heureArrivee: nowTime,
      status: 'pending',
      isGeolocValid: isInZone,
      latitude: inputs.latitude,
      longitude: inputs.longitude,
      amount: amount,
      validatedAt: null,
    }).fetch();

    // Notifier l'incubé
    try {
      await sails.helpers.sender.notification.with({
        recipientId: incubeId,
        model: 'incube',
        app: 'ci',
        title: 'Présence enregistrée',
        content: isInZone
          ? 'Votre présence a été enregistrée avec succès.'
          : 'Votre présence a été enregistrée mais vous étiez hors zone.',
        priority: 'low',
        isForAdmin: false
      });
    } catch (err) {
      sails.log.error('Erreur lors de l\'envoi de la notification de présence :', err);
    }

    if (!isInZone) {
      return {
        ...newPresence,
        message: 'Vous êtes hors zone, mais votre présence a été enregistrée à titre indicatif.'
      };
    }

    return newPresence;
  }
};
