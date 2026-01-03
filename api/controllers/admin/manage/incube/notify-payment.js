module.exports = {
  friendlyName: 'Notify Payment Info',
  description: 'Notify an incube to update their banking information urgently.',

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
      // 1. Send in-app notification
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
        sails.log.error('Failed to send notification in notify-payment:', err);
      }

      // 2. Send email
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
      sails.log.error('Failed to send payment notification email:', error);
    }

    // Notify Admin (Confirmation)
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Notification envoyée',
      content: `Une notification urgente (paiement) a été envoyée à l'incubé ${incube.prenom} ${incube.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return { message: `Payment notification sent to ${incube.email}` };
  }
};
