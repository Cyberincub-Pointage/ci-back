module.exports = {
  friendlyName: 'Obtenir tous les projets',
  description: 'Récupérer la liste de tous les projets.',
  inputs: {},
  exits: {
    success: {
      description: 'Liste des projets récupérée avec succès.'
    }
  },
  fn: async function () {
    const projects = await Projet.find().populate('equipe');
    return projects;
  }
};
