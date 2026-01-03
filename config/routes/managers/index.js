const ManagersFormateurRoutes = require('./formateur');
const ManagersIncubeRoutes = require('./incube');

module.exports = Object.assign(
  ManagersFormateurRoutes,
  ManagersIncubeRoutes,
);