module.exports = {
  friendlyName: 'Get One Bank',
  description: 'Retrieve details of a specific bank.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the bank to retrieve.'
    }
  },
  exits: {
    success: {
      description: 'Bank details retrieved successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Bank not found.'
    }
  },
  fn: async function ({ id }) {
    const bank = await Banque.findOne({ id });

    if (!bank) {
      throw 'notFound';
    }

    // Manual population of Incubes related to this Bank
    const incubes = await Incube.find({ banque: id })
      .populate('equipe')
      .populate('projet')
      .populate('banque');

    // Attach incubes to the bank object
    bank.incubes = incubes;

    return bank;
  }
};
