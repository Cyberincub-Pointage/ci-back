module.exports = {
  friendlyName: 'Logout',
  description: 'Logout as Admin.',

  exits: {
    success: {
      description: 'Logout successful.'
    }
  },

  fn: async function () {
    return { message: 'Déconnexion réussie.' };
  }
};
