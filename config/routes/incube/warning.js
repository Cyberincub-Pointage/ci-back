module.exports = {
  'GET /api/v1/incube/warnings': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/warnings/get-my-warnings',
    swagger: { tags: ['INCUBE - AVERTISSEMENTS'] }
  },
  'GET /api/v1/incube/warning/:id': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/warnings/get-one-warning',
    swagger: { tags: ['INCUBE - AVERTISSEMENTS'] }
  },
};
