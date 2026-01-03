module.exports = {
  friendlyName: 'Send Alert',
  description: 'Send an alert message to an incube (email or notification).',

  inputs: {
    id: {
      type: 'string',
      required: true
    },
    message: {
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

  fn: async function ({ id, message }) {
    const incube = await Incube.findOne({ id });
    if (!incube) { throw 'notFound'; }

    try {
      // 1. Send in-app notification
      try {
        await sails.helpers.sender.notification.with({
          recipientId: incube.id,
          model: 'incube',
          app: 'ci',
          title: 'Nouvelle alerte',
          content: message,
          priority: 'high',
          isForAdmin: false
        });
      } catch (err) {
        sails.log.error('Failed to send notification in send-alert:', err);
      }

      // 2. Send email
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'incube/alert',
        to: incube.email,
        subject: 'Alerte importante - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: incube.prenom,
          message: message,
          appUrl: appUrls
        }
      });

    } catch (error) {
      sails.log.error('Failed to send alert email:', error);
    }

    // Notify Admin (Confirmation)
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Alerte envoyée',
      content: `Une alerte a été envoyée à l'incubé ${incube.prenom} ${incube.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return { message: `Alert sent to ${incube.email}` };
  }
};
