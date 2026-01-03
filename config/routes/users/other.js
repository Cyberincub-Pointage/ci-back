module.exports = {

  /**
   * * ===============================================
   * AMOUNT ROUTES
   * * ===============================================
   */
  'GET /api/v1/users/get-daily-amount': {
    policy: ['isAuthenticated'],
    action: 'users/amount/get-daily-amount',
    swagger: { tags: ['USERS - AMOUNT'] }
  },
};
