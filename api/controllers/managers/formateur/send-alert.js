module.exports = {
  friendlyName: 'Send Alert',
  description: 'Send an alert message to a formateur (email or notification).',

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
    const formateur = await Formateur.findOne({ id });
    if (!formateur) { throw 'notFound'; }

    try {
      // 1. Send in-app notification
      try {
        await sails.helpers.sender.notification.with({
          recipientId: formateur.id,
          model: 'formateur',
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
        template: 'formateur/alert',
        to: formateur.email,
        subject: 'Alerte importante - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: formateur.prenom,
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
      content: `Une alerte a été envoyée au formateur ${formateur.prenom} ${formateur.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return { message: `Alert sent to ${formateur.email}` };
  }
};
