module.exports = {
  'GET /api/v1/formateur/permission/email': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/permissions/get-permission-email',
    swagger: { tags: ['FORMATEUR - PERMISSION'] }
  },
  'PUT /api/v1/formateur/permission/email': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/permissions/update-permission-email',
    swagger: { tags: ['FORMATEUR - PERMISSION'] }
  },
};
