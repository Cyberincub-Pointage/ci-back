module.exports = {
  friendlyName: 'Logout',
  description: 'Logout as Incube.',

  exits: {
    success: {
      description: 'Logout successful.'
    }
  },

  fn: async function () {
    return { message: 'Déconnexion réussie.' };
  }
};
