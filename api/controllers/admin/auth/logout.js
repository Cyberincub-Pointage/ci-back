module.exports = {
  friendlyName: 'Déconnexion administrateur',
  description: 'Se déconnecter en tant qu\'administrateur.',

  exits: {
    success: {
      description: 'Déconnexion réussie.'
    }
  },

  fn: async function () {
    return { message: 'Déconnexion réussie.' };
  }
};
