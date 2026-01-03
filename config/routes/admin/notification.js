module.exports = {
  'GET /api/v1/admin/notifications': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/notification/list',
    swagger: { tags: ['ADMIN - NOTIFICATION'] }
  },

  'GET /api/v1/admin/notifications/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/notification/get-one',
    swagger: { tags: ['ADMIN - NOTIFICATION'] }
  },

  'PATCH /api/v1/admin/notifications/mark-all-read': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/notification/mark-all-read',
    swagger: { tags: ['ADMIN - NOTIFICATION'] }
  },

  'DELETE /api/v1/admin/notifications/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/notification/delete-one',
    swagger: { tags: ['ADMIN - NOTIFICATION'] }
  },
};
