module.exports = {
  'GET /swagger.json': {
    action: 'docs/serve-swagger',
    swagger: { tags: ['SWAGGER DOCUMENTATION'] }
  },
  'GET /api/v1/docs': {
    action: 'docs/serve-swagger-ui',
    swagger: { tags: ['SWAGGER DOCUMENTATION'] }
  },
  'GET /': {
    action: 'docs/home',
    swagger: { tags: ['SWAGGER DOCUMENTATION'] }
  },
};
