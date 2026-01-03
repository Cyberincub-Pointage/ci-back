module.exports = {
  'GET /api/v1/formateur/notifications': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/notification/list',
    swagger: { tags: ['FORMATEUR - NOTIFICATION'] }
  },
  'GET /api/v1/formateur/notifications/:id': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/notification/get-one',
    swagger: { tags: ['FORMATEUR - NOTIFICATION'] }
  },
  'PATCH /api/v1/formateur/notifications/mark-all-read': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/notification/mark-all-read',
    swagger: { tags: ['FORMATEUR - NOTIFICATION'] }
  },
  'DELETE /api/v1/formateur/notifications/:id': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/notification/delete-one',
    swagger: { tags: ['FORMATEUR - NOTIFICATION'] }
  },
};
