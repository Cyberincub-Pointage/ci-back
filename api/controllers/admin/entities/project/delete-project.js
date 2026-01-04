module.exports = {
  friendlyName: 'Supprimer un projet',
  description: 'Supprimer un projet.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID du projet à supprimer.'
    }
  },

  exits: {
    success: {
      description: 'Projet supprimé avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Projet non trouvé.'
    }
  },

  fn: async function ({ id }) {
    const deletedProject = await Projet.destroyOne({ id });

    if (!deletedProject) {
      throw 'notFound';
    }

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet supprimé',
      content: `Le projet ${deletedProject.nom} a été supprimé.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return deletedProject;
  }
};
