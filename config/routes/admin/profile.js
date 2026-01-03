module.exports = {
  'GET /api/v1/admin/me': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/profile/get-profile',
    swagger: { tags: ['ADMIN - PROFILE'] }
  },
  'PATCH /api/v1/admin/profile': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/profile/update-profile',
    swagger: { tags: ['ADMIN - PROFILE'] }
  },
  'PATCH /api/v1/admin/profile/password': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/profile/update-password',
    swagger: { tags: ['ADMIN - PROFILE'] }
  },
  'PATCH /api/v1/admin/profile/email': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/profile/update-email',
    swagger: { tags: ['ADMIN - PROFILE'] }
  },
};
