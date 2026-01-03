const formAuthRoutes = require('./auth');
const formIncubeRoutes = require('./incube');
const formNotificationRoutes = require('./notification');
const formPermissionRoutes = require('./permission');
const formProfileRoutes = require('./profile');

module.exports = Object.assign(
  formAuthRoutes,
  formIncubeRoutes,
  formNotificationRoutes,
  formPermissionRoutes,
  formProfileRoutes,
);