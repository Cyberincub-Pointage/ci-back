module.exports = {
  friendlyName: 'Get One Permission',
  description: 'Retrieve a single permission request by ID for the logged-in incubé.',

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

    // Verify ownership
    if (permission.incube !== incubeId) {
      throw 'forbidden';
    }

    return permission;
  }
};
