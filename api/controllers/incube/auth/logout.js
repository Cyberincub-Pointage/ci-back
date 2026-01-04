module.exports = {
  friendlyName: 'Déconnexion incube',
  description: 'Se déconnecter en tant qu\'Incubé.',

  exits: {
    success: {
      description: 'Déconnexion réussie.'
    }
  },

  fn: async function () {
    return { message: 'Déconnexion réussie.' };
  }
};
