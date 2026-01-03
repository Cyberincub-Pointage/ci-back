module.exports = {
  'POST /api/v1/notify-payment/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/incube/notify-payment',
    swagger: { tags: ['ADMIN - GESTION INCUBE'] }
  },
  'PATCH /api/v1/admin/incube/validate-bank/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/incube/validate-bank-update',
    swagger: { tags: ['ADMIN - GESTION INCUBE'] }
  },
  'PATCH /api/v1/admin/incube/presence-mark-paid/:presenceId': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/manage/incube/mark-presence-paid',
    swagger: { tags: ['ADMIN - GESTION INCUBE'] }
  },
};
