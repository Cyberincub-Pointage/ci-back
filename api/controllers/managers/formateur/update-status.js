module.exports = {
  friendlyName: 'Update Formateur Status',
  description: 'Activate, suspend, or pending a Formateur.',

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
      description: 'Formateur status updated.'
    },
    notFound: {
      description: 'Formateur not found.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, status }) {
    const updatedFormateur = await Formateur.updateOne({ id })
      .set({ status });

    if (!updatedFormateur) {
      throw 'notFound';
    }

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut mis à jour',
      content: `Le statut du formateur ${updatedFormateur.prenom} ${updatedFormateur.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedFormateur;
  }
};
