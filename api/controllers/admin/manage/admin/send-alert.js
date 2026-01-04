module.exports = {
  friendlyName: 'Envoyer une alerte',
  description: 'Envoyer un message d\'alerte à un administrateur (email ou notification).',

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
    const adminTarget = await Admin.findOne({ id });
    if (!adminTarget) { throw 'notFound'; }

    try {
      // Envoyer une notification in-app
      try {
        await sails.helpers.sender.notification.with({
          recipientId: adminTarget.id,
          model: 'admin',
          app: 'ci',
          title: 'Nouvelle alerte',
          content: message,
          priority: 'high',
          isForAdmin: true
        });
      } catch (err) {
        sails.log.error('Échec de l\'envoi de la notification dans send-alert :', err);
      }

      // Envoyer un email
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'admin/alert',
        to: adminTarget.email,
        subject: 'Alerte importante - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: adminTarget.prenom,
          message: message,
          appUrl: appUrls
        }
      });

    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email d\'alerte :', error);
    }

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Alerte envoyée',
      content: `Une alerte a été envoyée à l'administrateur ${adminTarget.prenom} ${adminTarget.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return { message: `Alerte envoyée à ${adminTarget.email}` };
  }
};
