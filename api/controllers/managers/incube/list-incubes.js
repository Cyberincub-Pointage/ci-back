module.exports = {
  friendlyName: 'Lister les incubés',
  description: 'Lister tous les incubés.',

  inputs: {
    search: {
      type: 'string',
      description: 'Rechercher par nom ou email'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended']
    },
  },

  exits: {
    success: {
      description: 'Liste des incubés.'
    }
  },

  fn: async function ({ search, status }) {
    let criteria = {};

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

    const incubes = await Incube.find(criteria)
      .populate('equipe')
      .populate('projet')
      .populate('banque');

    return incubes;
  }
};
