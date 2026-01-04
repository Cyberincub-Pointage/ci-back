module.exports = {
  friendlyName: 'Obtenir une permission (Formateur)',
  description: 'Récupérer une demande de permission par ID pour un formateur et la marquer comme vue si elle est en attente.',

  inputs: {
    id: {
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
    // Récupérer la permission
    const permission = await PermissionRequest.findOne({ id: inputs.id })
      .populate('incube')
      .populate('processedBy');

    if (!permission) {
      throw 'notFound';
    }

    // Mettre à jour seulement si le statut est 'pending'.
    if (permission.status === 'pending') {
      const now = new Date().toISOString();

      await PermissionRequest.updateOne({ id: inputs.id })
        .set({
          status: 'viewed',
          viewedAt: now
        });

      permission.status = 'viewed';
      permission.viewedAt = now;
    }

    return permission;
  }
};
