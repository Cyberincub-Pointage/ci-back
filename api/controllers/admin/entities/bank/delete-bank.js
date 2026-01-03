module.exports = {
  friendlyName: 'Delete Bank',
  description: 'Delete a bank.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the bank to delete.'
    }
  },
  exits: {
    success: {
      description: 'Bank deleted successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Bank not found.'
    }
  },
  fn: async function ({ id }) {
    const deletedBank = await Banque.destroyOne({ id });

    if (!deletedBank) {
      throw 'notFound';
    }


    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque supprimée',
      content: `La banque ${deletedBank.nom} a été supprimée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return deletedBank;
  }
};
