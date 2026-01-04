module.exports = {
  friendlyName: 'Obtenir un administrateur',
  description: 'Obtenir un seul administrateur par ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Administrateur trouvé.'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id }) {
    const admin = await Admin.findOne({ id });
    if (!admin) throw 'notFound';
    return admin;
  }
};
