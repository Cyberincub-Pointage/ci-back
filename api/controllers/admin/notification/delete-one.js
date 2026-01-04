module.exports = {
  friendlyName: 'Supprimer une notification',
  description: 'Supprimer une notification spécifique pour l\'administrateur connecté.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de la notification à supprimer.'
    }
  },

  exits: {
    success: {
      description: 'Notification supprimée avec succès.'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Notification non trouvée.'
    },
    forbidden: {
      responseType: 'forbidden',
      description: 'La notification n\'appartient pas à l\'administrateur.'
    }
  },

  fn: async function ({ id }) {
    const notification = await Notification.findOne({ id });

    if (!notification) {
      throw 'notFound';
    }

    // S'assurer que la notification appartient à cet administrateur
    if (notification.admin !== this.req.me.id) {
      throw 'forbidden';
    }

    const deletedNotification = await Notification.destroyOne({ id });

    return deletedNotification;
  }
};
