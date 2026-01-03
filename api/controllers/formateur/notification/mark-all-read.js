module.exports = {
  friendlyName: 'Mark all notifications as read',
  description: 'Mark all unread notifications for the logged-in formateur as read.',

  inputs: {},

  exits: {
    success: {
      description: 'All notifications marked as read.'
    }
  },

  fn: async function () {
    await Notification.update({
      formateur: this.req.me.id,
      status: 'unread'
    }).set({
      status: 'read'
    });

    return { message: 'All notifications marked as read.' };
  }
};
