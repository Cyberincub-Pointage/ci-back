module.exports = {
  'GET /api/v1/manager/get-incubes': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/list-incubes',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'GET /api/v1/manager/incube/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/get-one-incube',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'PATCH /api/v1/manager/update-incube-status/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/update-status',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'POST /api/v1/manager/incube/:id/alert': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/send-alert',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'GET /api/v1/manager/warnings': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/get-warnings',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'GET /api/v1/manager/warning/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/get-one-warning',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'GET /api/v1/manager/presence/all': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/get-all-presences',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
  'GET /api/v1/manager/presence/retro-requests': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/incube/get-retro-requests',
    swagger: { tags: ['MANAGERS - GESTION INCUBE'] }
  },
};
