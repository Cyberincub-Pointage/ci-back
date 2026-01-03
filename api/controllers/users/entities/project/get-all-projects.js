module.exports = {
  friendlyName: 'Get All Projects',
  description: 'Retrieve a list of all projects.',
  inputs: {},
  exits: {
    success: {
      description: 'List of projects retrieved successfully.'
    }
  },
  fn: async function () {
    const projects = await Projet.find().populate('equipe');
    return projects;
  }
};
