module.exports = {
  friendlyName: 'Update Team',
  description: 'Update team for the logged-in incube.',

  inputs: {
    equipe: {
      type: 'string',
      required: true,
      description: 'The ID of the new team.'
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

  fn: async function ({ equipe }) {
    const incubeId = this.req.me.id;
    const incube = await Incube.findOne({ id: incubeId });

    if (!incube) { throw 'notFound'; }

    const isTeamEmpty = !incube.equipe;

    if (!isTeamEmpty) {
      // Modification: Save to pending
      await Incube.updateOne({ id: incubeId }).set({
        pendingEquipe: equipe
      });

      // Notify Formateurs
      // We might want to notify formateurs associated with the NEW team or ALL formateurs.
      // Usually, it's better to notify "Formateur Principal" or similar. 
      // For now, I'll fetch all formateurs.
      const formateurs = await Formateur.find();

      for (const formateur of formateurs) {
        await sails.helpers.sender.notification.with({
          recipientId: formateur.id,
          model: 'formateur',
          app: 'ci',
          title: 'Validation Requise : Changement d\'équipe',
          content: `L'incubé ${incube.prenom} ${incube.nom} souhaite modifier son équipe.`,
          priority: 'normal',
          isForAdmin: false
        }).catch(err => sails.log.error('Failed to notify formateur:', err));
      }

      return { message: 'Demande de changement d\'équipe envoyée pour validation.', status: 'pending' };

    } else {
      // Direct update
      await Incube.updateOne({ id: incubeId }).set({
        equipe: equipe
      });

      return { message: 'Equipe mise à jour avec succès.', status: 'updated' };
    }
  }
};
