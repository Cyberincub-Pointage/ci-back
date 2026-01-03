module.exports = {
  friendlyName: 'Get One Project',
  description: 'Retrieve details of a specific project.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the project to retrieve.'
    }
  },
  exits: {
    success: {
      description: 'Project details retrieved successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Project not found.'
    }
  },
  fn: async function ({ id }) {
    const project = await Projet.findOne({ id }).populate('equipe');

    if (!project) {
      throw 'notFound';
    }

    let criteria = { projet: id };

    // Check if team is populated or just an ID
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

    // Attach incubes to the project object
    project.incubes = incubes;

    return project;
  }
};
