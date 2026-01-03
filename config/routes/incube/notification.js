module.exports = {
  'GET /api/v1/incube/notifications': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/notification/list',
    swagger: { tags: ['INCUBE - NOTIFICATION'] }
  },
  'GET /api/v1/incube/notifications/:id': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/notification/get-one',
    swagger: { tags: ['INCUBE - NOTIFICATION'] }
  },
  'PATCH /api/v1/incube/notifications/mark-all-read': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/notification/mark-all-read',
    swagger: { tags: ['INCUBE - NOTIFICATION'] }
  },
  'DELETE /api/v1/incube/notifications/:id': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/notification/delete-one',
    swagger: { tags: ['INCUBE - NOTIFICATION'] }
  },
};
