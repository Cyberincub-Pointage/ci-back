module.exports = {
  friendlyName: 'Get One Permission (Formateur)',
  description: 'Retrieve a single permission request by ID for a formateur and mark it as viewed if pending.',

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
    // 1. Fetch the permission with necessary associations
    const permission = await PermissionRequest.findOne({ id: inputs.id })
      .populate('incube')
      .populate('processedBy');

    if (!permission) {
      throw 'notFound';
    }

    // 2. Check if it needs to be marked as viewed
    // Only update if status is 'pending'. 
    // If it's already 'viewed', 'approved', or 'rejected', we don't change status.
    if (permission.status === 'pending') {
      const now = new Date().toISOString();

      await PermissionRequest.updateOne({ id: inputs.id })
        .set({
          status: 'viewed',
          viewedAt: now
        });

      // Update the in-memory object to reflect simple changes without re-fetching
      permission.status = 'viewed';
      permission.viewedAt = now;

      // Log the action (optional/useful debugging)
      // sails.log.info(`Permission ${inputs.id} marked as viewed by formateur.`);
    }

    return permission;
  }
};
