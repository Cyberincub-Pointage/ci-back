module.exports = {
  friendlyName: 'Delete Notification',
  description: 'Delete a specific notification for the logged-in formateur.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the notification to delete.'
    }
  },

  exits: {
    success: {
      description: 'Notification deleted successfully.'
    },
    notFound: {
      responseType: 'notFound',
      description: 'Notification not found.'
    },
    forbidden: {
      responseType: 'forbidden',
      description: 'Notification does not belong to the formateur.'
    }
  },

  fn: async function ({ id }) {
    const notification = await Notification.findOne({ id });

    if (!notification) {
      throw 'notFound';
    }

    // Ensure the notification belongs to this formateur
    if (notification.formateur !== this.req.me.id) {
      throw 'forbidden';
    }

    const deletedNotification = await Notification.destroyOne({ id });

    return deletedNotification;
  }
};
