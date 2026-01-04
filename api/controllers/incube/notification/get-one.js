module.exports = {
  friendlyName: 'Obtenir une notification',
  description: 'Obtenir une notification spécifique pour l\'incubé connecté.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      statusCode: 200
    },
    notFound: {
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function ({ id }) {
    const notification = await Notification.findOne({ id });

    if (!notification) {
      throw 'notFound';
    }

    // S'assurer que la notification appartient à cet incubé
    if (notification.incube !== this.req.me.id) {
      throw 'forbidden';
    }

    // Marquer comme lu si non lu
    if (notification.status === 'unread') {
      await Notification.updateOne({ id }).set({ status: 'read' });
      notification.status = 'read';
    }

    return notification;
  }
};
