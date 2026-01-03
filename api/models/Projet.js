module.exports = {
  attributes: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom du projet.'
    },
    description: {
      type: 'string',
      description: 'Une description détaillée du projet.'
    },
    equipe: {
      model: 'equipe',
      description: 'L\'équipe travaillant sur ce projet.'
    },
    incubes: {
      collection: 'incube',
      via: 'projet',
      description: 'Les incubés travaillant sur ce projet.'
    }
  }
};
