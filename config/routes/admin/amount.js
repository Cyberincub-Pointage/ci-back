module.exports = {
  'POST /api/v1/admin/set-daily-amount': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/amount/set-daily-amount',
    swagger: { tags: ['ADMIN - AMOUNT'] }
  },
  'GET /api/v1/admin/daily-amount/history': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/amount/get-history',
    swagger: { tags: ['ADMIN - AMOUNT'] }
  },
};
