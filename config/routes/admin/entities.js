module.exports = {

  /**
  * * ===============================================
  * TEAM
  * * ===============================================
  */
  'POST /api/v1/admin/teams': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/team/create-team',
    swagger: { tags: ['ADMIN - GESTION EQUIPE'] }
  },
  'PATCH /api/v1/admin/teams/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/team/update-team',
    swagger: { tags: ['ADMIN - GESTION EQUIPE'] }
  },
  'DELETE /api/v1/admin/teams/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/team/delete-team',
    swagger: { tags: ['ADMIN - GESTION EQUIPE'] }
  },


  /**
   * * ===============================================
   * PROJECT
   * * ===============================================
   */
  'POST /api/v1/admin/projects': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/project/create-project',
    swagger: { tags: ['ADMIN - GESTION PROJET'] }
  },
  'PATCH /api/v1/admin/projects/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/project/update-project',
    swagger: { tags: ['ADMIN - GESTION PROJET'] }
  },
  'DELETE /api/v1/admin/projects/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/project/delete-project',
    swagger: { tags: ['ADMIN - GESTION PROJET'] }
  },


  /**
   * * ===============================================
   * BANK
   * * ===============================================
   */
  'POST /api/v1/admin/banks': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/bank/create-bank',
    swagger: { tags: ['ADMIN - GESTION BANQUE'] }
  },
  'PATCH /api/v1/admin/banks/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/bank/update-bank',
    swagger: { tags: ['ADMIN - GESTION BANQUE'] }
  },
  'DELETE /api/v1/admin/banks/:id': {
    policy: ['isAuthenticated', 'isAdmin'],
    action: 'admin/entities/bank/delete-bank',
    swagger: { tags: ['ADMIN - GESTION BANQUE'] }
  },
};
