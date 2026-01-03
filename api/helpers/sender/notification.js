module.exports = {
  friendlyName: 'Créer une notification',
  description: 'Crée et stocke une nouvelle notification.',

  inputs: {
    recipientId: {
      type: 'string',
      required: true,
    },
    senderId: {
      type: 'string',
      allowNull: true,
    },
    app: {
      type: 'string',
      required: true,
    },
    model: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      required: true,
    },
    content: {
      type: 'string',
      required: true,
    },
    metadata: {
      type: 'json',
      defaultsTo: {},
    },
    priority: {
      type: 'string',
      isIn: ['low', 'normal', 'high', 'urgent'],
      defaultsTo: 'normal',
    },
    isForAdmin: {
      type: 'boolean',
      required: true,
    },
    slug: {
      type: 'string',
      allowNull: true,
    },
  },

  fn: async function (inputs, exits) {
    try {
      const dataToCreate = {
        title: inputs.title,
        content: inputs.content,
        metadata: inputs.metadata,
        priority: inputs.priority,
        status: 'unread'
      };

      // Map recipientId to the correct specific model association
      switch (inputs.model) {
        case 'incube':
          dataToCreate.incube = inputs.recipientId;
          break;
        case 'formateur':
          dataToCreate.formateur = inputs.recipientId;
          break;
        case 'admin':
          dataToCreate.admin = inputs.recipientId;
          break;
        default:
          sails.log.warn(`Unknown model type '${inputs.model}' for notification recipient.`);
        // We might want to throw error or proceed without linking (which might fail if requirements are strict)
      }

      const notification = await Notification.create(dataToCreate).fetch();

      sails.log.info(`Notification créée pour le ${inputs.model} (ID: ${inputs.recipientId}).`);
      return exits.success(notification);

    } catch (err) {
      sails.log.error('Erreur lors de la création de la notification:', err);
      return exits.error(err);
    }
  }
};
