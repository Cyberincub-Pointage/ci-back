const adminRoutes = require('./admin');
const formateurRoutes = require('./formateur');
const incubeRoutes = require('./incube');
const managersRoutes = require('./managers');
const swaggerRoutes = require('./swagger');
const usersRoutes = require('./users');

module.exports.routes = Object.assign(
  adminRoutes,
  formateurRoutes,
  incubeRoutes,
  managersRoutes,
  swaggerRoutes,
  usersRoutes
);
