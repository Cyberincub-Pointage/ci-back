module.exports = {
  friendlyName: 'Marquer la permission comme vue',
  description: 'Le formateur marque une demande de permission comme vue.',

  inputs: {
    permissionId: {
      type: 'string',
      required: true
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

  fn: async function (inputs) {
    const permission = await PermissionRequest.findOne({ id: inputs.permissionId });

    if (!permission) {
      throw 'notFound';
    }

    // Mettre à jour seulement si le statut est en attente et pas encore vu
    if (permission.status === 'pending' && !permission.viewedAt) {
      const updatedPermission = await PermissionRequest.updateOne({ id: inputs.permissionId })
        .set({
          status: 'viewed',
          viewedAt: new Date().toISOString()
        });

      sails.log.info(`Permission : Demande ${inputs.permissionId} marquée comme vue`);
      return updatedPermission;
    }

    // Retourner inchangé si déjà vu ou traité
    return permission;
  }
};
