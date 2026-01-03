module.exports = {
  friendlyName: 'Get One Team',
  description: 'Retrieve details of a specific team.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the team to retrieve.'
    }
  },
  exits: {
    success: {
      description: 'Team details retrieved successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Team not found.'
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
