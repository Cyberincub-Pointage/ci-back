module.exports.policies = {
  '*': true,

  'incube/auth/*': true,
  'incube/*': ['isAuthenticated', 'isIncube'],

  'formateur/auth/*': true,
  'formateur/*': ['isAuthenticated', 'isFormateur'],

  'admin/auth/*': true,
  'admin/*': ['isAuthenticated', 'isAdmin'],

  'users/*': ['isAuthenticated'],

  'managers/*': ['isAuthenticated', 'isManager'],
};
