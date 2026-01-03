module.exports = {
  friendlyName: 'Mark Presence',
  description: 'Allow an incube to mark their presence for the day.',

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
      description: 'Presence already marked for today.'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];

    // Check if already exists
    const existing = await Presence.findOne({
      incube: incubeId,
      date: today
    });

    if (existing) {
      throw 'alreadyExists';
    }

    // Target Coordinates from config
    const { latitude: targetLat, longitude: targetLon, radius: allowedRadius } = sails.config.custom.presenceZone;

    const distance = await sails.helpers.geo.getDistance.with({
      lat1: inputs.latitude,
      lon1: inputs.longitude,
      lat2: targetLat,
      lon2: targetLon
    });
    const isInZone = distance <= allowedRadius;

    sails.log.info(`MarkPresence: User ${incubeId} at distance ${distance}m (Allowed: ${allowedRadius}m) -> InZone: ${isInZone}`);

    // Removed the throw for distance > allowedRadius to allow marking presence even if out of zone
    // if (distance > allowedRadius) {
    //   throw {
    //     badRequest: `Géolocalisation invalide. Vous devez être sur le site (Distance: ${Math.round(distance)}m).`
    //   };
    // }

    // Determine Daily Amount
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

    // Notify incubé
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
      sails.log.error('Error sending presence notification:', err);
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
