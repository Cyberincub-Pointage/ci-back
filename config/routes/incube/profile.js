module.exports = {
  'GET /api/v1/incube/me': {
    action: 'incube/profile/get-profile',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile': {
    action: 'incube/profile/update-profile',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/password': {
    action: 'incube/profile/update-password',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile/bank': {
    action: 'incube/profile/update-bank',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
  'PATCH /api/v1/incube/profile/team': {
    action: 'incube/profile/update-team',
    swagger: { tags: ['INCUBE - PROFILE'] }
  },
};
