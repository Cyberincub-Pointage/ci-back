module.exports = {
  friendlyName: 'Update Formateur Role',
  description: 'Update the role of a formateur (e.g. promote to principal or demote).',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn: ['formateur', 'formateur_principal'],
      required: true
    }
  },

  exits: {
    success: {
      description: 'Formateur role updated.'
    },
    notFound: {
      description: 'Formateur not found.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, role }) {
    sails.log.info(`[debug] update-role called with id: "${id}", role: "${role}"`);
    const updatedFormateur = await Formateur.updateOne({ id })
      .set({ role });

    if (!updatedFormateur) {
      throw 'notFound';
    }

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Rôle mis à jour',
      content: `Le rôle du formateur ${updatedFormateur.prenom} ${updatedFormateur.nom} a été mis à jour à "${role}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedFormateur;
  }
};
