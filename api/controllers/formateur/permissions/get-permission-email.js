module.exports = {
  friendlyName: 'Obtenir l\'email de permission',
  description: 'Obtenir l\'adresse email utilisée pour les demandes de permission.',

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

    // Récupérer l'enregistrement
    let config = await PermissionEmail.find().limit(1);

    // Fournir l'email de la configuration s'il existe
    const email = (config && config.length > 0) ? config[0].value : null;

    return { email };
  }
};
