module.exports = {
  friendlyName: 'Get One Notification',
  description: 'Get a specific notification for the logged-in admin.',

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

    // Ensure the notification belongs to this admin
    if (notification.admin !== this.req.me.id) {
      throw 'forbidden';
    }

    // Mark as read if unread
    if (notification.status === 'unread') {
      await Notification.updateOne({ id }).set({ status: 'read' });
      notification.status = 'read';
    }

    return notification;
  }
};
