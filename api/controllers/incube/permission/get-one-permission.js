module.exports = {
  friendlyName: 'Obtenir une permission',
  description: 'Récupérer une demande de permission unique par ID pour l\'incubé connecté.',

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
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;

    const permission = await PermissionRequest.findOne({ id: inputs.id })
      .populate('processedBy');

    if (!permission) {
      throw 'notFound';
    }

    // Vérifier la propriété
    if (permission.incube !== incubeId) {
      throw 'forbidden';
    }

    return permission;
  }
};
