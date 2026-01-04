module.exports = {
  friendlyName: 'Obtenir les permissions',
  description: 'Le formateur récupère toutes les demandes de permission, filtrées optionnellement par statut.',

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
