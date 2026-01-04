module.exports = {
  friendlyName: 'Valider la mise à jour bancaire',
  description: 'Valider ou rejeter une mise à jour bancaire en attente pour un incubé.',

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
      if (!incube.pendingRib && !incube.pendingBanque) {
        return { message: 'Aucune modification en attente trouvé.' };
      }

      // Appliquer les changements
      await Incube.updateOne({ id }).set({
        rib: incube.pendingRib,
        banque: incube.pendingBanque,
        pendingRib: '',
        pendingBanque: null
      });

      // Notifier l'Incubé
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
      // Rejeter les changements : effacer les champs en attente
      await Incube.updateOne({ id }).set({
        pendingRib: '',
        pendingBanque: null
      });

      // Notifier l'Incubé
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
