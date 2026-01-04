module.exports = {
  friendlyName: 'Obtenir un projet',
  description: 'Récupérer les détails d\'un projet spécifique.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID du projet à récupérer.'
    }
  },
  exits: {
    success: {
      description: 'Détails du projet récupérés avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Projet non trouvé.'
    }
  },
  fn: async function ({ id }) {
    const project = await Projet.findOne({ id }).populate('equipe');

    if (!project) {
      throw 'notFound';
    }

    let criteria = { projet: id };

    // Vérifier si l'équipe est peuplée ou juste un ID
    const equipeId = (project.equipe && project.equipe.id)
      ? project.equipe.id
      : (project.equipe && typeof project.equipe !== 'object' ? project.equipe : null);

    if (equipeId) {
      criteria = {
        or: [
          { projet: id },
          { equipe: equipeId }
        ]
      };
    }

    const incubes = await Incube.find(criteria)
      .populate('equipe')
      .populate('banque')
      .populate('projet');

    // Attacher les incubés à l'objet projet
    project.incubes = incubes;

    return project;
  }
};
