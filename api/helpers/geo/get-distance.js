module.exports = {
  friendlyName: 'Get Distance',
  description: 'Calculate distance between two coordinates using Haversine formula.',
  inputs: {
    lat1: {
      type: 'number',
      required: true
    },
    lon1: {
      type: 'number',
      required: true
    },
    lat2: {
      type: 'number',
      required: true
    },
    lon2: {
      type: 'number',
      required: true
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'Distance in meters',
      outputType: 'number'
    }
  },
  fn: async function (inputs) {
    const R = 6371e3; // metres
    const dLat = (inputs.lat2 - inputs.lat1) * Math.PI / 180;
    const dLon = (inputs.lon2 - inputs.lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(inputs.lat1 * Math.PI / 180) * Math.cos(inputs.lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
};
