module.exports = {
  friendlyName: 'Get All Teams',
  description: 'Retrieve a list of all teams.',
  inputs: {},
  exits: {
    success: {
      description: 'List of teams retrieved successfully.'
    }
  },
  fn: async function () {
    const teams = await Equipe.find().populate('formateur');
    return teams;
  }
};
