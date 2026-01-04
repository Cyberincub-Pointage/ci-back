module.exports = {
  friendlyName: 'Traiter une permission',
  description: 'Le formateur approuve ou rejette une demande de permission.',

  inputs: {
    permissionId: {
      type: 'string',
      required: true
    },
    approved: {
      type: 'boolean',
      required: true
    },
    rejectionReason: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs) {
    const formateurId = this.req.me.id;

    const permission = await PermissionRequest.findOne({ id: inputs.permissionId });
    if (!permission) {
      throw 'notFound';
    }

    // Validate rejection reason is provided when rejecting
    if (!inputs.approved && !inputs.rejectionReason) {
      throw { badRequest: 'Un motif de rejet est requis.' };
    }

    const updates = {
      status: inputs.approved ? 'approved' : 'rejected',
      processedBy: formateurId,
      processedAt: new Date().toISOString()
    };

    // Si le statut était 'pending', marquer comme vu
    if (permission.status === 'pending' && !permission.viewedAt) {
      updates.viewedAt = new Date().toISOString();
    }

    // Ajouter le motif de rejet si rejeté
    if (!inputs.approved && inputs.rejectionReason) {
      updates.rejectionReason = inputs.rejectionReason;
    }

    const updatedPermission = await PermissionRequest.updateOne({ id: inputs.permissionId })
      .set(updates);

    sails.log.info(`Permission : Demande ${inputs.permissionId} ${inputs.approved ? 'approuvée' : 'rejetée'} par le formateur ${formateurId}`);

    // Notifier l'incubé
    try {
      const incube = await Incube.findOne({ id: permission.incube });
      if (incube) {
        const typeLabels = {
          absence: 'Absence',
          retard: 'Retard',
          sortie_anticipee: 'Sortie anticipée',
          autre: 'Autre'
        };

        await sails.helpers.sender.notification.with({
          recipientId: incube.id,
          model: 'incube',
          app: 'ci',
          title: `Permission ${inputs.approved ? 'approuvée' : 'refusée'}`,
          content: inputs.approved
            ? `Votre demande de permission (${typeLabels[permission.type]}) a été approuvée.`
            : `Votre demande de permission (${typeLabels[permission.type]}) a été refusée. Motif: ${inputs.rejectionReason}`,
          priority: 'high',
          isForAdmin: false
        });
      }
    } catch (err) {
      sails.log.error('Erreur lors de l\'envoi de la notification de permission :', err);
    }

    return updatedPermission;
  }
};
