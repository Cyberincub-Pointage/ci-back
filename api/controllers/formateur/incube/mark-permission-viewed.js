module.exports = {
  friendlyName: 'Mark Permission Viewed',
  description: 'Formateur marks a permission request as viewed.',

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

    // Only update if status is pending and not already viewed
    if (permission.status === 'pending' && !permission.viewedAt) {
      const updatedPermission = await PermissionRequest.updateOne({ id: inputs.permissionId })
        .set({
          status: 'viewed',
          viewedAt: new Date().toISOString()
        });

      sails.log.info(`Permission: Marked request ${inputs.permissionId} as viewed`);
      return updatedPermission;
    }

    // Return unchanged if already viewed or processed
    return permission;
  }
};
