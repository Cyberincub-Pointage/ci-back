module.exports = {
  friendlyName: 'Get Permission Email',
  description: 'Get the email address used for permission requests.',

  inputs: {},

  exits: {
    success: {
      responseType: 'ok'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },


  fn: async function (inputs) {
    if (this.req.me.role !== 'formateur_principal') {
      throw 'forbidden';
    }

    // Fetch the single permissionEmail record
    let config = await PermissionEmail.find().limit(1);

    // Provide the email from config if it exists
    const email = (config && config.length > 0) ? config[0].value : null;

    return { email };
  }
};
