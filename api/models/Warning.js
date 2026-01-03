module.exports = {
  attributes: {
    motif: {
      type: 'string',
      required: true,
      description: 'Le motif de l\'avertissement.'
    },
    description: {
      type: 'string',
      columnType: 'text',
      description: 'Une description détaillée de l\'avertissement.'
    },
    date: {
      type: 'ref',
      columnType: 'date',
      required: true,
      description: 'La date de l\'avertissement.'
    },
    incube: {
      model: 'incube',
      required: true,
      description: 'L\'incubé recevant l\'avertissement.'
    },
    formateur: {
      model: 'formateur',
      required: true,
      description: 'Le formateur émettant l\'avertissement.'
    }
  },

  // Lifecycle callback pour générer un ULID avant la création
  beforeCreate: function (values, proceed) {
    const { ulid } = require('ulid');
    if (!values.id) {
      values.id = ulid();
    }
    return proceed();
  }
};
