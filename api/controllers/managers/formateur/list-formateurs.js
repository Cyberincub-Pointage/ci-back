module.exports = {
  friendlyName: 'List Formateurs',
  description: 'List all Formateurs.',

  inputs: {
    search: {
      type: 'string',
      description: 'Search by name or email'
    },
    role: {
      type: 'string',
      isIn: ['formateur', 'formateur_principal'],
    },
    status: {
      type: 'string',
      isIn: ['active', 'suspended', 'pending']
    },
  },

  exits: {
    success: {
      description: 'List retrieved successfully.'
    }
  },

  fn: async function ({ search, role, status }) {
    let criteria = {
      role: { in: ['formateur', 'formateur_principal'] }
    };

    if (role) {
      criteria.role = role;
    }

    if (status) {
      criteria.status = status;
    }

    if (search) {
      const lower = search.toLowerCase();
      const upper = search.toUpperCase();
      const capitalized = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();

      criteria.or = [
        // Nom variants
        { nom: { contains: search } },
        { nom: { contains: lower } },
        { nom: { contains: capitalized } },
        { nom: { contains: upper } },
        // Prénom variants
        { prenom: { contains: search } },
        { prenom: { contains: lower } },
        { prenom: { contains: capitalized } },
        { prenom: { contains: upper } },
        // Email variants
        { email: { contains: search } },
        { email: { contains: lower } }
      ];
    }

    const formateurs = await Formateur.find(criteria);
    return formateurs;
  }
};
