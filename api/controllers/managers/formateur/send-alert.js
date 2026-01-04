module.exports = {
  friendlyName: 'Envoyer une alerte',
  description: 'Envoyer un message d\'alerte à un formateur (email ou notification).',

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
      // Envoyer une notification
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
        sails.log.error('Échec de l\'envoi de la notification dans send-alert :', err);
      }

      // Envoyer un email
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
      sails.log.error('Échec de l\'envoi de l\'email d\'alerte :', error);
    }

    // Notifier l'admin (Confirmation)
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Alerte envoyée',
      content: `Une alerte a été envoyée au formateur ${formateur.prenom} ${formateur.nom}.`,
      priority: 'low',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    return { message: `Alert sent to ${formateur.email}` };
  }
};
