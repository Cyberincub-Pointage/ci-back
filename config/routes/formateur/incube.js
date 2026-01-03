module.exports = {
  'PATCH /api/v1/formateur/incube/validate-team/:id': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/validate-team-update',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'PATCH /api/v1/formateur/incube/validate-presence/:presenceId': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/validate-presence',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'PATCH /api/v1/formateur/incube/validate-retro/:requestId': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/validate-retro',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'GET /api/v1/formateur/incube/permissions': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/get-permissions',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'GET /api/v1/formateur/incube/permission/:id': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/get-one-permission',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'PATCH /api/v1/formateur/incube/permission/:permissionId/view': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/mark-permission-viewed',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'PATCH /api/v1/formateur/incube/permission/:permissionId/process': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/process-permission',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
  'POST /api/v1/formateur/warning': {
    policy: ['isAuthenticated', 'isFormateur'],
    action: 'formateur/incube/create-warning',
    swagger: { tags: ['FORMATEUR - GESTION INCUBE'] }
  },
};
