module.exports = {
  friendlyName: 'Renvoyer l\'invitation',
  description: 'Renvoyer l\'email d\'invitation à un formateur en attente.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Invitation renvoyée.'
    },
    notFound: {
      responseType: 'notFound'
    },
    alreadyActive: {
      description: 'L\'utilisateur est déjà actif.'
    }
  },

  fn: async function ({ id }) {
    const formateur = await Formateur.findOne({ id });
    if (!formateur) throw 'notFound';
    if (formateur.status === 'active') throw 'alreadyActive';

    const crypto = require('crypto');

    // Générer un nouveau token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await Formateur.updateOne({ id }).set({
      invitationToken,
      invitationTokenExpiresAt
    });

    // Envoyer l\'email
    try {
      const admin = await Admin.findOne({ id: this.req.me.id });
      const inviterName = admin ? `${admin.prenom} ${admin.nom}` : 'Un administrateur';
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'formateur/invite',
        to: formateur.email,
        subject: 'Relance : Invitation à rejoindre l\'administration CI',
        appSlug: 'ci',
        templateData: {
          firstName: formateur.prenom,
          inviterName: inviterName,
          role: formateur.role,
          invitationLink: `${appUrls}/auth/invite-form?token=${invitationToken}`,
          expirationDelay: '24 heures'
        }
      });

      // Notifier l'admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Invitation renvoyée',
        content: `L'invitation pour le formateur ${formateur.prenom} ${formateur.nom} a été renvoyée.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    } catch (e) {
      sails.log.error('Échec du renvoi de l\'invitation :', e);
    }

    return { message: 'Invitation renvoyée avec succès' };
  }
};
