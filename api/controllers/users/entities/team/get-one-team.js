module.exports = {
  friendlyName: 'Obtenir une équipe',
  description: 'Récupérer les détails d\'une équipe spécifique.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de l\'équipe à récupérer.'
    }
  },
  exits: {
    success: {
      description: 'Détails de l\'équipe récupérés avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Équipe non trouvée.'
    }
  },
  fn: async function ({ id }) {
    const team = await Equipe.findOne({ id })
      .populate('formateur')
      .populate('projets');

    if (!team) {
      throw 'notFound';
    }

    const membres = await Incube.find({ equipe: id })
      .populate('banque')
      .populate('projet')
      .populate('equipe');

    team.membres = membres;

    return team;
  }
};
