module.exports = {
  friendlyName: 'Marquer comme payé',
  description: 'Marquer une présence comme payée.',

  inputs: {
    presenceId: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs) {
    const updated = await Presence.updateOne({ id: inputs.presenceId }).set({
      paymentStatus: 'paid'
    });

    if (!updated) { throw 'notFound'; }

    // Récupérer l'incubé pour la notification
    const incube = await Incube.findOne({ id: updated.incube });

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Présence marquée payée',
      content: `La présence de ${incube ? incube.prenom + ' ' + incube.nom : 'Incubé inconnu'} a été marquée comme payée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updated;
  }
};
