module.exports = {
  friendlyName: 'Supprimer une banque',
  description: 'Supprimer une banque.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de la banque à supprimer.'
    }
  },

  exits: {
    success: {
      description: 'Banque supprimée avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Banque non trouvée.'
    }
  },

  fn: async function ({ id }) {
    const deletedBank = await Banque.destroyOne({ id });

    if (!deletedBank) {
      throw 'notFound';
    }

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque supprimée',
      content: `La banque ${deletedBank.nom} a été supprimée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return deletedBank;
  }
};
