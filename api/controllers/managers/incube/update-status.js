module.exports = {
  friendlyName: 'Update Incube Status',
  description: 'Activate or deactivate an Incube.',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      required: true
    }
  },

  exits: {
    success: {
      description: 'Incube status updated.'
    },
    notFound: {
      description: 'Incube not found.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, status }) {
    const updatedIncube = await Incube.updateOne({ id })
      .set({ status });

    if (!updatedIncube) {
      throw 'notFound';
    }

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut Incubé mis à jour',
      content: `Le statut de l'incubé ${updatedIncube.prenom} ${updatedIncube.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedIncube;
  }
};
