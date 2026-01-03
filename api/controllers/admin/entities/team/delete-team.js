module.exports = {
  friendlyName: 'Delete Team',
  description: 'Delete a team.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the team to delete.'
    }
  },
  exits: {
    success: {
      description: 'Team deleted successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Team not found.'
    }
  },
  fn: async function ({ id }) {
    const deletedTeam = await Equipe.destroyOne({ id });

    if (!deletedTeam) {
      throw 'notFound';
    }


    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe supprimée',
      content: `L'équipe ${deletedTeam.nom} a été supprimée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return deletedTeam;
  }
};
