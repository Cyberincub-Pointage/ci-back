module.exports = {
  friendlyName: 'Marquer tout comme lu',
  description: 'Marquer toutes les notifications non lues comme lues pour l\'administrateur connecté.',

  inputs: {},

  exits: {
    success: {
      description: 'Toutes les notifications ont été marquées comme lues.'
    }
  },

  fn: async function () {
    await Notification.update({
      admin: this.req.me.id,
      status: 'unread'
    }).set({
      status: 'read'
    });

    return { message: 'Toutes les notifications ont été marquées comme lues.' };
  }
};
