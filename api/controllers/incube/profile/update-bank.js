module.exports = {
  friendlyName: 'Mettre à jour les infos bancaires',
  description: 'Mettre à jour les informations bancaires (RIB et banque) pour l\'incubé connecté.',

  inputs: {
    rib: {
      type: 'string',
      required: true,
      description: 'Le nouveau RIB.'
    },
    banque: {
      type: 'string',
      required: true,
      description: 'L\'ID de la nouvelle banque.'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    },
    serverError: {
      responseType: 'serverError'
    }
  },

  fn: async function ({ rib, banque }) {
    const incubeId = this.req.me.id;

    // Récupérer les données actuelles de l\'incubé
    const incube = await Incube.findOne({ id: incubeId });
    if (!incube) { throw 'notFound'; }

    const isBankEmpty = !incube.rib && !incube.banque;
    const isModification = !isBankEmpty;

    if (isModification) {
      // Modification : Sauvegarder dans les champs en attente
      await Incube.updateOne({ id: incubeId }).set({
        pendingRib: rib,
        pendingBanque: banque
      });

      const admins = await Admin.find();

      for (const admin of admins) {
        await sails.helpers.sender.notification.with({
          recipientId: admin.id,
          model: 'admin',
          app: 'ci',
          title: 'Validation Requise : Infos Bancaires',
          content: `L'incubé ${incube.prenom} ${incube.nom} a demandé une modification de ses infos bancaires.`,
          priority: 'urgent',
          isForAdmin: true
        }).catch(err => sails.log.error('Échec de la notification de l\'admin pour la mise à jour bancaire :', err));
      }

      return { message: 'Demande de modification envoyée à l\'admin pour validation.', status: 'pending' };

    } else {
      // Mise à jour directe (Première fois)
      await Incube.updateOne({ id: incubeId }).set({
        rib: rib,
        banque: banque
      });

      return { message: 'Informations bancaires mises à jour avec succès.', status: 'updated' };
    }
  }
};
