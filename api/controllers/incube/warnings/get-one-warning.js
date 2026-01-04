module.exports = {

  friendlyName: 'Obtenir un avertissement',
  description: 'Obtenir les détails d\'un avertissement spécifique et le marquer comme lu.',

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
    const warning = await Warning.findOne({ id: inputs.id })
      .populate('formateur');

    if (!warning) {
      throw 'notFound';
    }

    if (warning.incube !== this.req.me.id) {
      throw 'forbidden';
    }

    return warning;
  }
};
