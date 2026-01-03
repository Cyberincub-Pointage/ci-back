module.exports = {
  friendlyName: 'Update Permission Email',
  description: 'Update the email address used for permission requests.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

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

    // Check if configuration exists
    const existing = await PermissionEmail.find().limit(1);

    if (existing && existing.length > 0) {
      await PermissionEmail.update({ id: existing[0].id }).set({ value: inputs.email });
    } else {
      await PermissionEmail.create({
        value: inputs.email
      });
    }

    return { message: 'Email de permission mis à jour avec succès.' };
  }
};
