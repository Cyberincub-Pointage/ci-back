module.exports = {
  friendlyName: 'Obtenir un formateur',
  description: 'Obtenir un formateur unique par ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Formateur trouvé.'
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
