module.exports = {
  friendlyName: 'Supprimer une équipe',
  description: 'Supprimer une équipe.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de l\'équipe à supprimer.'
    }
  },

  exits: {
    success: {
      description: 'Équipe supprimée avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Équipe non trouvée.'
    }
  },

  fn: async function ({ id }) {
    const deletedTeam = await Equipe.destroyOne({ id });

    if (!deletedTeam) {
      throw 'notFound';
    }

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe supprimée',
      content: `L'équipe ${deletedTeam.nom} a été supprimée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return deletedTeam;
  }
};
