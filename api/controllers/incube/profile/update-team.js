module.exports = {
  friendlyName: 'Mettre à jour l\'équipe',
  description: 'Mettre à jour l\'équipe pour l\'incubé connecté.',

  inputs: {
    equipe: {
      type: 'string',
      required: true,
      description: 'L\'ID de la nouvelle équipe.'
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
      // Modification : Sauvegarder en attente
      await Incube.updateOne({ id: incubeId }).set({
        pendingEquipe: equipe
      });

      // Notifier les formateurs
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
        }).catch(err => sails.log.error('Échec de la notification du formateur :', err));
      }

      return { message: 'Demande de changement d\'équipe envoyée pour validation.', status: 'pending' };

    } else {
      // Mise à jour directe
      await Incube.updateOne({ id: incubeId }).set({
        equipe: equipe
      });

      return { message: 'Equipe mise à jour avec succès.', status: 'updated' };
    }
  }
};
