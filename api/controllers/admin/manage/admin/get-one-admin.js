module.exports = {
  friendlyName: 'Get One Admin',
  description: 'Get a single admin by ID.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Admin found.'
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
