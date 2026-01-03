module.exports = {
  friendlyName: 'Get My Permissions',
  description: 'Retrieve all permission requests for the logged-in incubé.',

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
