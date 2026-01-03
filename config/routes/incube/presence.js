module.exports = {
  'POST /api/v1/incube/presence/check-zone': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/presence/check-zone',
    swagger: { tags: ['INCUBE - GESTION PRESENCE'] }
  },
  'POST /api/v1/incube/presence/mark': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/presence/mark-presence',
    swagger: { tags: ['INCUBE - GESTION PRESENCE'] }
  },
  'POST /api/v1/incube/presence/request-retro': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/presence/request-retro',
    swagger: { tags: ['INCUBE - GESTION PRESENCE'] }
  },
  'GET /api/v1/incube/presence/my': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/presence/get-my-presences',
    swagger: { tags: ['INCUBE - GESTION PRESENCE'] }
  },
  'GET /api/v1/incube/presence/my-retro': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/presence/get-my-retro-requests',
    swagger: { tags: ['INCUBE - GESTION PRESENCE'] }
  },
};
