const adminAmountRoutes = require('./amount');
const adminAdminRoutes = require('./admin');
const adminAuthRoutes = require('./auth');
const adminEntitiesRoutes = require('./entities');
const adminIncubeRoutes = require('./incube');
const adminNotificationRoutes = require('./notification');
const adminProfileRoutes = require('./profile');

module.exports = Object.assign(
  adminAmountRoutes,
  adminAdminRoutes,
  adminAuthRoutes,
  adminEntitiesRoutes,
  adminIncubeRoutes,
  adminNotificationRoutes,
  adminProfileRoutes,
);