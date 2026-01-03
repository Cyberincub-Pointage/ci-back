module.exports = {
  friendlyName: 'Validate Team Update',
  description: 'Validate or reject a pending team update for an incube.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the incube.'
    },
    approve: {
      type: 'boolean',
      required: true,
      description: 'Whether to approve or reject the update.'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function ({ id, approve }) {
    const incube = await Incube.findOne({ id });
    if (!incube) { throw 'notFound'; }

    if (approve) {
      if (!incube.pendingEquipe) {
        return { message: 'Aucune demande de changement d\'équipe trouvée.' };
      }

      // Apply changes
      await Incube.updateOne({ id }).set({
        equipe: incube.pendingEquipe,
        pendingEquipe: null
      });

      // Notify Incube
      await sails.helpers.sender.notification.with({
        recipientId: incube.id,
        model: 'incube',
        app: 'ci',
        title: 'Changement d\'équipe validé',
        content: `Votre demande de changement d'équipe a été acceptée.`,
        priority: 'normal',
        isForAdmin: false
      });

      return { message: 'Changement d\'équipe validé.' };

    } else {
      // Reject changes
      await Incube.updateOne({ id }).set({
        pendingEquipe: null
      });

      // Notify Incube
      await sails.helpers.sender.notification.with({
        recipientId: incube.id,
        model: 'incube',
        app: 'ci',
        title: 'Changement d\'équipe refusé',
        content: `Votre demande de changement d'équipe a été refusée.`,
        priority: 'normal',
        isForAdmin: false
      });

      return { message: 'Demande de changement d\'équipe refusée.' };
    }
  }
};
