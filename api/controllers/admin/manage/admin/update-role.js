module.exports = {
  friendlyName: 'Mettre à jour le rôle admin',
  description: 'Mettre à jour le rôle d\'un administrateur (ex: promouvoir en super_admin).',

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
      description: 'Rôle administrateur mis à jour.'
    },
    notFound: {
      description: 'Administrateur non trouvé.',
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

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Rôle admin mis à jour',
      content: `Le rôle de l'administrateur ${updatedAdmin.prenom} ${updatedAdmin.nom} a été mis à jour à "${role}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return updatedAdmin;
  }
};
