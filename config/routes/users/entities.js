module.exports = {

  /**
  * * ===============================================
  * TEAM
  * * ===============================================
  */
  'GET /api/v1/users/teams': {
    policy: ['isAuthenticated'],
    action: 'users/entities/team/get-all-teams',
    swagger: { tags: ['USERS - EQUIPE'] }
  },
  'GET /api/v1/users/teams/:id': {
    policy: ['isAuthenticated'],
    action: 'users/entities/team/get-one-team',
    swagger: { tags: ['USERS - EQUIPE'] }
  },

  /**
  * * ===============================================
  * PROJECT
  * * ===============================================
  */
  'GET /api/v1/users/projects': {
    policy: ['isAuthenticated'],
    action: 'users/entities/project/get-all-projects',
    swagger: { tags: ['USERS - PROJET'] }
  },
  'GET /api/v1/users/projects/:id': {
    policy: ['isAuthenticated'],
    action: 'users/entities/project/get-one-project',
    swagger: { tags: ['USERS - PROJET'] }
  },

  /**
  * * ===============================================
  * BANK
  * * ===============================================
  */
  'GET /api/v1/users/banks': {
    policy: ['isAuthenticated'],
    action: 'users/entities/bank/get-all-banks',
    swagger: { tags: ['USERS - BANQUE'] }
  },
  'GET /api/v1/users/banks/:id': {
    policy: ['isAuthenticated'],
    action: 'users/entities/bank/get-one-bank',
    swagger: { tags: ['USERS - BANQUE'] }
  },
};
