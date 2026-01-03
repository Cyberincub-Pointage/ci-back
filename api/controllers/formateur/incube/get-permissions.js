module.exports = {
  friendlyName: 'Get Permissions',
  description: 'Formateur retrieves all permission requests, optionally filtered by status.',

  inputs: {
    status: {
      type: 'string',
      isIn: ['pending', 'viewed', 'approved', 'rejected']
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function (inputs) {
    const criteria = {};

    if (inputs.status) {
      criteria.status = inputs.status;
    }

    const permissions = await PermissionRequest.find(criteria)
      .populate('incube')
      .populate('processedBy')
      .sort('createdAt DESC');

    return permissions;
  }
};
