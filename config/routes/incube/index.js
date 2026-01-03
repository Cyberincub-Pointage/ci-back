const incubeAuthRoutes = require('./auth');
const incubeNotificationRoutes = require('./notification');
const incubePermissionRoutes = require('./permission');
const incubePresenceRoutes = require('./presence');
const incubeProfileRoutes = require('./profile');
const incubeWarningRoutes = require('./warning');


module.exports = Object.assign(
  incubeAuthRoutes,
  incubeNotificationRoutes,
  incubePermissionRoutes,
  incubePresenceRoutes,
  incubeProfileRoutes,
  incubeWarningRoutes,
);