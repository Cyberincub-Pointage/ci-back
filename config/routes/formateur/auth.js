module.exports = {
  'POST /api/v1/formateur/auth/login': {
    action: 'formateur/auth/login',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
  'POST /api/v1/formateur/auth/logout': {
    action: 'formateur/auth/logout',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
  'GET /api/v1/formateur/auth/invitation-info': {
    action: 'formateur/auth/get-invitation-info',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
  'POST /api/v1/formateur/auth/accept-invitation': {
    action: 'formateur/auth/accept-invitation',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
  'POST /api/v1/formateur/auth/forgot-password': {
    action: 'formateur/auth/forgot-password',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
  'POST /api/v1/formateur/auth/reset-password': {
    action: 'formateur/auth/reset-password',
    swagger: { tags: ['FORMATEUR - AUTH'] }
  },
};
