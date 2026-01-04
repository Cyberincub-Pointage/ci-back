module.exports = {
  friendlyName: 'Demander une permission',
  description: 'L\'incubé demande une permission.',

  inputs: {
    type: {
      type: 'string',
      required: true,
      isIn: ['absence', 'retard', 'sortie_anticipee', 'autre']
    },
    motif: {
      type: 'string',
      required: true
    },
    dateDebut: {
      type: 'string',
      required: true
    },
    dateFin: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'ok'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs) {
    const incubeId = this.req.me.id;

    try {
      // Valider le format de date (vérification de base)
      if (!inputs.dateDebut.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw { badRequest: 'Format de date invalide. Utilisez YYYY-MM-DD.' };
      }

      if (inputs.dateFin && !inputs.dateFin.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw { badRequest: 'Format de date de fin invalide. Utilisez YYYY-MM-DD.' };
      }

      // Obtenir la date d'aujourd'hui (sans l'heure)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      // Valider que la date de début est aujourd'hui ou dans le futur
      if (inputs.dateDebut < todayStr) {
        throw { badRequest: 'La date de début doit être aujourd\'hui ou dans le futur.' };
      }

      // Valider que la date de fin est après la date de début si fournie
      if (inputs.dateFin && inputs.dateFin < inputs.dateDebut) {
        throw { badRequest: 'La date de fin doit être après la date de début.' };
      }

      const incube = await Incube.findOne({ id: incubeId });
      if (!incube) { throw 'notFound'; }

      const typeLabels = {
        absence: 'Absence',
        retard: 'Retard',
        sortie_anticipee: 'Sortie anticipée',
        autre: 'Autre'
      };

      const permission = await PermissionRequest.create({
        incube: incubeId,
        type: inputs.type,
        motif: inputs.motif,
        dateDebut: inputs.dateDebut,
        dateFin: inputs.dateFin || null,
        status: 'pending',
        viewedAt: null,
        processedAt: null
      }).fetch();

      sails.log.info(`Permission : Demande créée ${permission.id} pour l'incubé ${incubeId}`);

      // Notifier l'incubé (confirmation)
      try {
        await sails.helpers.sender.notification.with({
          recipientId: incubeId,
          model: 'incube',
          app: 'ci',
          title: 'Demande de permission enregistrée',
          content: `Votre demande de permission (${inputs.type}) a été enregistrée et sera traitée prochainement.`,
          priority: 'normal',
          isForAdmin: false
        });
      } catch (err) {
        sails.log.error('Erreur lors de l\'envoi de la notification de confirmation de permission :', err);
      }

      // Notifier tous les formateurs actifs
      try {
        const formateurs = await Formateur.find({ status: 'active' });
        for (const formateur of formateurs) {
          await sails.helpers.sender.notification.with({
            recipientId: formateur.id,
            model: 'formateur',
            app: 'ci',

            title: 'Nouvelle demande de permission',
            content: `L'incubé ${incube.prenom} ${incube.nom} a soumis une nouvelle demande de permission (${typeLabels[inputs.type]}) pour le ${inputs.dateDebut}.`,
            priority: 'normal',
            isForAdmin: false
          }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification au formateur :', err));
        }
      } catch (err) {
        sails.log.error('Erreur lors de la notification des formateurs :', err);
      }

      // Envoyer un email à l'adresse de permission
      try {
        // Récupérer l'email dynamique permissionEmail
        const config = await PermissionEmail.find().limit(1);
        const permissionEmail = (config && config.length > 0) ? config[0].value : null;
        const appUrls = sails.config.custom.appUrl;

        await sails.helpers.sender.email.with({
          layout: 'default-layout',
          template: 'incube/permission-request',
          to: permissionEmail,
          subject: 'Nouvelle demande de permission - CyberIncub',
          appSlug: 'ci',
          templateData: {
            incubeName: incube ? `${incube.prenom} ${incube.nom}` : 'Incubé',
            permissionType: typeLabels[inputs.type] || inputs.type,
            motif: inputs.motif,
            dateDebut: inputs.dateDebut,
            dateFin: inputs.dateFin || null,
            appUrl: appUrls
          }
        });
      } catch (emailErr) {
        sails.log.error('Erreur lors de l\'envoi de l\'email de permission :', emailErr);
      }

      return permission;

    } catch (err) {
      // Passer les sorties connues
      if (err.badRequest) {
        throw err;
      }

      // Vérifier les erreurs de validation
      if (err.code === 'E_VALIDATION') {
        throw { badRequest: 'Données invalides (vérifiez la longueur du motif).' };
      }

      sails.log.error('Erreur lors de la création de la demande de permission :', err);
      throw { badRequest: 'Une erreur interne est survenue lors du traitement de votre demande.' };
    }
  }
};
