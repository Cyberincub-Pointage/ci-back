module.exports = {
  friendlyName: 'Check Zone',
  description: 'Check if the provided coordinates are within the allowed presence zone.',

  inputs: {
    latitude: {
      type: 'number',
      required: true
    },
    longitude: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs) {
    // Target Coordinates from config
    const { latitude: targetLat, longitude: targetLon, radius: allowedRadius } = sails.config.custom.presenceZone;

    const distance = await sails.helpers.geo.getDistance.with({
      lat1: inputs.latitude,
      lon1: inputs.longitude,
      lat2: targetLat,
      lon2: targetLon
    });
    const isInZone = distance <= allowedRadius;

    sails.log.info(`CheckZone: Distance ${distance}m (Allowed: ${allowedRadius}m) -> InZone: ${isInZone}`);

    return {
      isInZone: isInZone,
      distance: Math.round(distance),
      allowedRadius: allowedRadius
    };
  }
};
