module.exports = {
  attributes: {
    title: {
      type: 'string',
      required: true,
      description: 'Le titre de la notification.'
    },
    content: {
      type: 'string',
      required: true,
      description: 'Le contenu de la notification.'
    },
    status: {
      type: 'string',
      isIn: ['unread', 'read'],
      defaultsTo: 'unread',
      description: 'Le statut de lecture de la notification.'
    },
    priority: {
      type: 'string',
      isIn: ['low', 'normal', 'high', 'urgent'],
      defaultsTo: 'normal',
      description: 'La priorité de la notification.'
    },
    metadata: {
      type: 'json',
      defaultsTo: {},
      description: 'Métadonnées supplémentaires pour la notification.'
    },
    incube: {
      model: 'incube',
      description: 'L\'incubé destinataire de la notification (si applicable).'
    },
    formateur: {
      model: 'formateur',
      description: 'Le formateur destinataire de la notification (si applicable).'
    },
    admin: {
      model: 'admin',
      description: 'L\'administrateur destinataire de la notification (si applicable).'
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
