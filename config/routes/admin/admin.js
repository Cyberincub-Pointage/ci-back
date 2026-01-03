module.exports = {
  'POST /api/v1/admin/add-admin': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/create-admin',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'GET /api/v1/admin/get-admins': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/list-admins',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'GET /api/v1/admin/admins/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/get-one-admin',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'POST /api/v1/admin/resend-admin-invite/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/resend-invite',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'POST /api/v1/admin/admin/:id/alert': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/send-alert',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'PATCH /api/v1/admin/update-admin-role/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/update-role',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
  'PATCH /api/v1/admin/update-admin-status/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/admin/update-status',
    swagger: { tags: ['ADMIN - GESTION ADMIN'] }
  },
};
