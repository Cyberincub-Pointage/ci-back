module.exports = {
  'POST /api/v1/manager/add-formateur': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/create-formateur',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'POST /api/v1/manager/resend-formateur-invite/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/resend-invite',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'GET /api/v1/manager/get-formateurs': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/list-formateurs',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'GET /api/v1/manager/formateur/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/get-one-formateur',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'PATCH /api/v1/manager/update-formateur-status/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/update-status',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'PATCH /api/v1/manager/update-formateur-role/:id': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/update-role',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
  'POST /api/v1/manager/formateur/:id/alert': {
    policy: ['isAuthenticated', 'isManager'],
    action: 'managers/formateur/send-alert',
    swagger: { tags: ['MANAGERS - GESTION FORMATEUR'] }
  },
};
