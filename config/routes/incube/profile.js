module.exports = {
  'GET /api/v1/incube/me': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/profile/get-profile',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/profile/update-profile',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/password': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/profile/update-password',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile/bank': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/profile/update-bank',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile/team': {
    policy: ['isAuthenticated', 'isIncube'],
    action: 'incube/profile/update-team',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
};
