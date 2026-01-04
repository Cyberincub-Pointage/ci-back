module.exports = {
  friendlyName: 'Lister les formateurs',
  description: 'Lister tous les formateurs.',

  inputs: {
    search: {
      type: 'string',
      description: 'Rechercher par nom ou email'
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
      description: 'Liste récupérée avec succès.'
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
