module.exports = {
  friendlyName: 'Déconnexion formateur',
  description: 'Se déconnecter en tant que Formateur.',

  exits: {
    success: {
      description: 'Déconnexion réussie.'
    }
  },

  fn: async function () {
    return { message: 'Déconnexion réussie.' };
  }
};
