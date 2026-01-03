module.exports = {
  friendlyName: 'Update Bank Info',
  description: 'Update bank info (rib and bank) for the logged-in incube.',

  inputs: {
    rib: {
      type: 'string',
      required: true,
      description: 'The new RIB.'
    },
    banque: {
      type: 'string',
      required: true,
      description: 'The ID of the new bank.'
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

    // Fetch current incube data
    const incube = await Incube.findOne({ id: incubeId });
    if (!incube) { throw 'notFound'; }

    const isBankEmpty = !incube.rib && !incube.banque;
    const isModification = !isBankEmpty;

    if (isModification) {
      // Modification: Save to pending fields
      await Incube.updateOne({ id: incubeId }).set({
        pendingRib: rib,
        pendingBanque: banque
      });

      // Notify ALL Admins about the request (or specific admins if logic existed)
      // For now, we'll try to find admins. Ideally, we might notify a "super_admin" or just log it.
      // Since the requirement says "notify admin", we'll attempt to send a notification to admins.

      const admins = await Admin.find();
      // This could be spammy if many admins, but standard for now.

      for (const admin of admins) {
        await sails.helpers.sender.notification.with({
          recipientId: admin.id,
          model: 'admin',
          app: 'ci',
          title: 'Validation Requise : Infos Bancaires',
          content: `L'incubé ${incube.prenom} ${incube.nom} a demandé une modification de ses infos bancaires.`,
          priority: 'urgent',
          isForAdmin: true
        }).catch(err => sails.log.error('Failed to notify admin about bank update:', err));
      }

      return { message: 'Demande de modification envoyée à l\'admin pour validation.', status: 'pending' };

    } else {
      // Direct update (First time)
      await Incube.updateOne({ id: incubeId }).set({
        rib: rib,
        banque: banque
      });

      return { message: 'Informations bancaires mises à jour avec succès.', status: 'updated' };
    }
  }
};
