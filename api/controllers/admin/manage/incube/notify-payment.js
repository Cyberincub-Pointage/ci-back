module.exports = {
  friendlyName: 'Notifier infos de paiement',
  description: 'Notifier un incubé pour mettre à jour ses informations bancaires de toute urgence.',

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
    }
  },

  fn: async function ({ id }) {
    const incube = await Incube.findOne({ id });
    if (!incube) { throw 'notFound'; }

    const message = "URGENT : Merci de renseigner vos informations bancaires immédiatement dans votre profil pour permettre le traitement de vos paiements.";

    try {
      // Envoyer une notification
      try {
        await sails.helpers.sender.notification.with({
          recipientId: incube.id,
          model: 'incube',
          app: 'ci',
          title: 'Action Requise : Informations Bancaires',
          content: message,
          priority: 'urgent',
          isForAdmin: false
        });
      } catch (err) {
        sails.log.error('Échec de l\'envoi de la notification dans notify-payment :', err);
      }

      // Envoyer un email
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'incube/urgent-action',
        to: incube.email,
        subject: 'URGENT : Action requise sur votre compte CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: incube.prenom,
          message: message,
          appUrl: appUrls
        }
      });

    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email de notification de paiement :', error);
    }

    // Notifier l'Administrateur (Confirmation)
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Notification envoyée',
      content: `Une notification urgente (paiement) a été envoyée à l'incubé ${incube.prenom} ${incube.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return { message: `Notification de paiement envoyée à ${incube.email}` };
  }
};
