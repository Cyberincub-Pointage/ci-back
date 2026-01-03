module.exports = {
  'POST /api/v1/admin/auth/login': {
    action: 'admin/auth/login',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
  'POST /api/v1/admin/auth/logout': {
    action: 'admin/auth/logout',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
  'POST /api/v1/admin/auth/forgot-password': {
    action: 'admin/auth/forgot-password',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
  'POST /api/v1/admin/auth/reset-password': {
    action: 'admin/auth/reset-password',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
  'GET /api/v1/admin/auth/invitation-info': {
    action: 'admin/auth/get-invitation-info',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
  'POST /api/v1/admin/auth/accept-invitation': {
    action: 'admin/auth/accept-invitation',
    swagger: { tags: ['ADMIN - AUTH'] }
  },
};
