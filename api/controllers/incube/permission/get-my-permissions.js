module.exports = {
  friendlyName: 'Obtenir mes permissions',
  description: 'Récupérer toutes les demandes de permission pour l\'incubé connecté.',

  inputs: {},

  exits: {
    success: {
      responseType: 'ok'
    }
  },

  fn: async function () {
    const incubeId = this.req.me.id;

    const permissions = await PermissionRequest.find({
      incube: incubeId
    })
      .populate('processedBy')
      .sort('createdAt DESC');

    return permissions;
  }
};
