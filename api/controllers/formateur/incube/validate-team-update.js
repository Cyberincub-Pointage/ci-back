module.exports = {
  friendlyName: 'Valider le changement d\'équipe',
  description: 'Valider ou rejeter une mise à jour d\'équipe en attente pour un incubé.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de l\'incubé.'
    },
    approve: {
      type: 'boolean',
      required: true,
      description: 'Approuver ou rejeter la mise à jour.'
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

      // Appliquer les changements
      await Incube.updateOne({ id }).set({
        equipe: incube.pendingEquipe,
        pendingEquipe: null
      });

      // Notifier l'incubé
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
      // Rejeter les changements
      await Incube.updateOne({ id }).set({
        pendingEquipe: null
      });

      // Notifier l'incubé
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
