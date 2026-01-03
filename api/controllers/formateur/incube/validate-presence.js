module.exports = {
  friendlyName: 'Validate Presence',
  description: 'Formateur validates or rejects a presence.',

  inputs: {
    presenceId: {
      type: 'string',
      required: true
    },
    approved: {
      type: 'boolean',
      required: true
    },
    reason: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function (inputs) {
    const formateurId = this.req.me.id;

    const presence = await Presence.findOne({ id: inputs.presenceId });
    if (!presence) { throw 'notFound'; }

    const updates = {
      status: inputs.approved ? 'validated' : 'rejected',
      validatedBy: formateurId,
      validatedAt: new Date().toISOString()
    };

    if (!inputs.approved) {
      if (!inputs.reason) {
        throw { badRequest: 'Un motif est requis pour le refus.' };
      }
      updates.rejectionReason = inputs.reason;
    }

    const updated = await Presence.updateOne({ id: inputs.presenceId }).set(updates);

    // Notify incubé
    try {
      await sails.helpers.sender.notification.with({
        recipientId: presence.incube,
        model: 'incube',
        app: 'ci',
        title: inputs.approved ? 'Présence validée' : 'Présence refusée',
        content: inputs.approved
          ? `Votre présence du ${presence.date} a été validée.`
          : `Votre présence du ${presence.date} a été refusée. Motif: ${inputs.reason}`,
        priority: 'normal',
        isForAdmin: false
      });
    } catch (err) {
      sails.log.error('Error sending presence validation notification:', err);
    }

    return updated;
  }
};
