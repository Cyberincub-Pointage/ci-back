module.exports = {
  friendlyName: 'Get All Admins',
  description: 'Get all admins with optional filtering.',

  inputs: {
    search: {
      type: 'string',
      description: 'Search by name or email'
    },
    role: {
      type: 'string',
      isIn: ['admin', 'super_admin']
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    serverError: {
      responseType: 'serverError'
    }
  },

  fn: async function ({ search, role }) {
    let query = {};

    if (search) {
      query.or = [
        { nom: { contains: search } },
        { prenom: { contains: search } },
        { email: { contains: search } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const admins = await Admin.find(query).sort('createdAt DESC');

    return admins;
  }
};
