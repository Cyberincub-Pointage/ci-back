module.exports = {
  friendlyName: 'Mettre à jour le statut admin',
  description: 'Activer, suspendre ou mettre en attente un Administrateur.',

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
      description: 'Statut administrateur mis à jour.'
    },
    notFound: {
      description: 'Administrateur non trouvé.',
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function ({ id, status }) {
    if (this.req.me.role !== 'super_admin') {
      throw 'forbidden';
    }

    const updatedAdmin = await Admin.updateOne({ id })
      .set({ status });

    if (!updatedAdmin) {
      throw 'notFound';
    }

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut admin mis à jour',
      content: `Le statut de l'administrateur ${updatedAdmin.prenom} ${updatedAdmin.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return updatedAdmin;
  }
};
