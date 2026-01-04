module.exports = {
  friendlyName: 'Mettre à jour l\'email de permission',
  description: 'Mettre à jour l\'adresse email utilisée pour les demandes de permission.',

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

    // Vérifier si la configuration existe
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
