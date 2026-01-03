module.exports = {
  attributes: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de la banque.'
    },
    code: {
      type: 'string',
      required: true,
      unique: true,
      description: 'Le code unique identifiant la banque.'
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
