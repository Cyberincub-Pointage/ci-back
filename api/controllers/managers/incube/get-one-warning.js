module.exports = {

  friendlyName: 'Obtenir un avertissement',
  description: 'Obtenir les détails d\'un avertissement spécifique (Vue Formateur).',

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
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function (inputs) {
    if (!this.req.me) {
      throw 'forbidden';
    }

    const warning = await Warning.findOne({ id: inputs.id })
      .populate('incube')
      .populate('formateur');

    if (!warning) {
      throw 'notFound';
    }

    if (warning.formateur.id !== this.req.me.id && warning.formateur !== this.req.me.id) {
      if (warning.formateur.id !== this.req.me.id) throw 'forbidden';
    }

    return warning;
  }
};
