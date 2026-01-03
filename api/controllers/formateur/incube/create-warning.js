module.exports = {

  friendlyName: 'Create warning',
  description: 'Create a new warning for an incube.',

  inputs: {
    incubeId: {
      type: 'string',
      required: true
    },
    motif: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    date: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    invalidData: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs) {
    if (!this.req.me) {
      throw 'invalidData';
    }

    const newWarning = await Warning.create({
      incube: inputs.incubeId,
      formateur: this.req.me.id,
      motif: inputs.motif,
      description: inputs.description,
      date: inputs.date
    }).fetch();

    // Notify incubé
    try {
      const incube = await Incube.findOne({ id: inputs.incubeId });
      if (incube) {
        await sails.helpers.sender.notification.with({
          recipientId: inputs.incubeId,
          model: 'incube',
          app: 'ci',
          title: 'Nouvel avertissement',
          content: `Vous avez reçu un avertissement : ${inputs.motif}. Consultez les détails dans votre espace.`,
          priority: 'high',
          isForAdmin: false
        });
      }
    } catch (err) {
      sails.log.error('Error sending warning notification to incubé:', err);
    }

    // Notify formateur (confirmation)
    try {
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'formateur',
        app: 'ci',
        title: 'Avertissement créé',
        content: `L'avertissement pour l'incubé a été créé avec succès.`,
        priority: 'low',
        isForAdmin: false
      });
    } catch (err) {
      sails.log.error('Error sending warning confirmation to formateur:', err);
    }

    return newWarning;
  }
};
