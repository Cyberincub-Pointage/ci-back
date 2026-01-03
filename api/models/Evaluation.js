module.exports = {
  attributes: {
    date: {
      type: 'string',
      columnType: 'date',
      required: true,
      description: 'La date de l\'évaluation.'
    },
    noteCompetence: {
      type: 'number',
      min: 0,
      max: 20,
      description: 'La note de compétence sur 20.'
    },
    noteAssiduite: {
      type: 'number',
      min: 0,
      max: 20,
      description: 'La note d\'assiduité sur 20.'
    },
    noteParticipation: {
      type: 'number',
      min: 0,
      max: 20,
      description: 'La note de participation sur 20.'
    },
    commentaire: {
      type: 'string',
      columnType: 'text',
      description: 'Un commentaire libre sur l\'évaluation.'
    },
    incube: {
      model: 'incube',
      required: true,
      description: 'L\'incubé concerné par cette évaluation.'
    },
    formateur: {
      model: 'formateur',
      required: true,
      description: 'Le formateur ayant réalisé l\'évaluation.'
    }
  }
};
