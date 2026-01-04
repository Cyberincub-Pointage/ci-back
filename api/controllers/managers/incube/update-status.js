module.exports = {
  friendlyName: 'Mettre à jour le statut de l\'incubé',
  description: 'Activer ou désactiver un incubé.',

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
      description: 'Statut de l\'incubé mis à jour.'
    },
    notFound: {
      description: 'Incubé non trouvé.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, status }) {
    const updatedIncube = await Incube.updateOne({ id })
      .set({ status });

    if (!updatedIncube) {
      throw 'notFound';
    }

    // Notifier l'admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut Incubé mis à jour',
      content: `Le statut de l'incubé ${updatedIncube.prenom} ${updatedIncube.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    return updatedIncube;
  }
};
