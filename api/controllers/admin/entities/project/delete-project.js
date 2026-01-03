module.exports = {
  friendlyName: 'Delete Project',
  description: 'Delete a project.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the project to delete.'
    }
  },
  exits: {
    success: {
      description: 'Project deleted successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Project not found.'
    }
  },
  fn: async function ({ id }) {
    const deletedProject = await Projet.destroyOne({ id });

    if (!deletedProject) {
      throw 'notFound';
    }


    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet supprimé',
      content: `Le projet ${deletedProject.nom} a été supprimé.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return deletedProject;
  }
};
