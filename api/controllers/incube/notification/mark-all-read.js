module.exports = {
  friendlyName: 'Tout marquer comme lu',
  description: 'Marquer toutes les notifications non lues de l\'incubé connecté comme lues.',

  inputs: {},

  exits: {
    success: {
      description: 'Toutes les notifications marquées comme lues.'
    }
  },

  fn: async function () {
    await Notification.update({
      incube: this.req.me.id,
      status: 'unread'
    }).set({
      status: 'read'
    });

    return { message: 'Toutes les notifications ont été marquées comme lues.' };
  }
};
