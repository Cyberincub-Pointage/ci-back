module.exports = {
  'POST /api/v1/incube/auth/register': {
    action: 'incube/auth/register',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
  'POST /api/v1/incube/auth/verify-email': {
    action: 'incube/auth/verify-email',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
  'POST /api/v1/incube/auth/login': {
    action: 'incube/auth/login',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
  'POST /api/v1/incube/auth/logout': {
    action: 'incube/auth/logout',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
  'POST /api/v1/incube/auth/forgot-password': {
    action: 'incube/auth/forgot-password',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
  'POST /api/v1/incube/auth/reset-password': {
    action: 'incube/auth/reset-password',
    swagger: { tags: ['INCUBE - AUTH'] }
  },
};
