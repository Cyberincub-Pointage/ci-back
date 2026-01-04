module.exports = {
  friendlyName: 'Mettre à jour le statut du formateur',
  description: 'Activer, suspendre ou mettre en attente un formateur.',

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
      description: 'Statut du formateur mis à jour.'
    },
    notFound: {
      description: 'Formateur non trouvé.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, status }) {
    const updatedFormateur = await Formateur.updateOne({ id })
      .set({ status });

    if (!updatedFormateur) {
      throw 'notFound';
    }

    // Notifier l'admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut mis à jour',
      content: `Le statut du formateur ${updatedFormateur.prenom} ${updatedFormateur.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    return updatedFormateur;
  }
};
