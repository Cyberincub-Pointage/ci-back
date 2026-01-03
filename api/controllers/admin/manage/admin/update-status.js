module.exports = {
  friendlyName: 'Update Admin Status',
  description: 'Activate, suspend, or set pending status for an Admin.',

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
      description: 'Admin status updated.'
    },
    notFound: {
      description: 'Admin not found.',
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

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Statut admin mis à jour',
      content: `Le statut de l'administrateur ${updatedAdmin.prenom} ${updatedAdmin.nom} a été mis à jour à "${status}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedAdmin;
  }
};
