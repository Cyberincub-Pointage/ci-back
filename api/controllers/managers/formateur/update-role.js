module.exports = {
  friendlyName: 'Mettre à jour le rôle du formateur',
  description: 'Mettre à jour le rôle d\'un formateur (ex: promouvoir en principal ou rétrograder).',

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
      description: 'Rôle du formateur mis à jour.'
    },
    notFound: {
      description: 'Formateur non trouvé.',
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

    // Notifier l'admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Rôle mis à jour',
      content: `Le rôle du formateur ${updatedFormateur.prenom} ${updatedFormateur.nom} a été mis à jour à "${role}".`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    return updatedFormateur;
  }
};
