module.exports = {
  friendlyName: 'Validate Bank Update',
  description: 'Validate or reject a pending bank update for an incube.',

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
      if (!incube.pendingRib && !incube.pendingBanque) {
        return { message: 'Aucune modification en attente trouvé.' };
      }

      // Apply changes
      await Incube.updateOne({ id }).set({
        rib: incube.pendingRib,
        banque: incube.pendingBanque,
        pendingRib: '',
        pendingBanque: null
      });

      // Notify Incube
      await sails.helpers.sender.notification.with({
        recipientId: incube.id,
        model: 'incube',
        app: 'ci',
        title: 'Mise à jour d\'information bancaires validée',
        content: `Vos nouvelles informations bancaires ont été validées par l'administrateur.`,
        priority: 'normal',
        isForAdmin: false
      });

      return { message: 'Informations bancaires mises à jour.' };

    } else {
      // Reject changes: just clear the pending fields
      await Incube.updateOne({ id }).set({
        pendingRib: '',
        pendingBanque: null
      });

      // Notify Incube
      await sails.helpers.sender.notification.with({
        recipientId: incube.id,
        model: 'incube',
        app: 'ci',
        title: 'Mise à jour d\'information bancaires refusée',
        content: `Votre demande de modification d'informations bancaires a été refusée.`,
        priority: 'urgent',
        isForAdmin: false
      });

      return { message: 'Demande de modification refusée.' };
    }
  }
};
