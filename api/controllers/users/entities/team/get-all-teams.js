module.exports = {
  friendlyName: 'Obtenir toutes les équipes',
  description: 'Récupérer la liste de toutes les équipes.',
  inputs: {},
  exits: {
    success: {
      description: 'Liste des équipes récupérée avec succès.'
    }
  },
  fn: async function () {
    const teams = await Equipe.find().populate('formateur');
    return teams;
  }
};
