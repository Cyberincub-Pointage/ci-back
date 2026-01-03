module.exports = {
  friendlyName: 'Update Admin Role',
  description: 'Update the role of an admin (e.g. promote to super_admin).',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn: ['admin', 'super_admin'],
      required: true
    }
  },

  exits: {
    success: {
      description: 'Admin role updated.'
    },
    notFound: {
      description: 'Admin not found.',
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function ({ id, role }) {
    if (this.req.me.role !== 'super_admin') {
      throw 'forbidden';
    }

    const updatedAdmin = await Admin.updateOne({ id })
      .set({ role });

    if (!updatedAdmin) {
      throw 'notFound';
    }

    // Notify Admin (Me) that I updated someone else's role
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Rôle admin mis à jour',
      content: `Le rôle de l'administrateur ${updatedAdmin.prenom} ${updatedAdmin.nom} a été mis à jour à "${role}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedAdmin;
  }
};
