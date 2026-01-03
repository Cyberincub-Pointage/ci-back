const usersEntitiesRoutes = require('./entities');
const usersOtherRoutes = require('./other');

module.exports = Object.assign(
  usersEntitiesRoutes,
  usersOtherRoutes,
);