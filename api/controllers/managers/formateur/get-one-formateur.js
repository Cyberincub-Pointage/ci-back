module.exports = {
  friendlyName: 'Get One Formateur',
  description: 'Get a single formateur by ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Formateur found.'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id }) {
    const formateur = await Formateur.findOne({ id });
    if (!formateur) throw 'notFound';
    return formateur;
  }
};
