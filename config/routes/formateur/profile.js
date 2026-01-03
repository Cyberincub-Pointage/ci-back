module.exports = {
  'GET /api/v1/formateur/me': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/profile/get-profile',
    swagger: { tags: ['FORMATEUR - PROFILE'] }
  },
  'PATCH /api/v1/formateur/profile': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/profile/update-profile',
    swagger: { tags: ['FORMATEUR - PROFILE'] }
  },
  'PATCH /api/v1/formateur/profile/password': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/profile/update-password',
    swagger: { tags: ['FORMATEUR - PROFILE'] }
  },
};
