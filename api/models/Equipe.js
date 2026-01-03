module.exports = {
  attributes: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de l\'équipe.'
    },
    description: {
      type: 'string',
      description: 'Une brève description de l\'équipe.'
    },
    formateur: {
      model: 'formateur',
      description: 'Le formateur responsable de l\'équipe.'
    },
    membres: {
      collection: 'incube',
      via: 'equipe',
      description: 'La liste des incubés membres de l\'équipe.'
    },
    projets: {
      collection: 'projet',
      via: 'equipe',
      description: 'Les projets associés à cette équipe.'
    }
  },
};
