module.exports = {
  'POST /api/v1/incube/permission/request': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/permission/request-permission',
    swagger: { tags: ['INCUBE - GESTION PERMISSION'] }
  },
  'GET /api/v1/incube/permission/my': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/permission/get-my-permissions',
    swagger: { tags: ['INCUBE - GESTION PERMISSION'] }
  },
  'GET /api/v1/incube/permission/:id': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/permission/get-one-permission',
    swagger: { tags: ['INCUBE - GESTION PERMISSION'] }
  },
};
