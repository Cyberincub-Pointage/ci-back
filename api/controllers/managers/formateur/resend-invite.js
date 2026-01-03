module.exports = {
  friendlyName: 'Resend Invitation',
  description: 'Resend invitation email to a pending formateur.',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Invitation resent.'
    },
    notFound: {
      responseType: 'notFound'
    },
    alreadyActive: {
      description: 'User is already active.'
    }
  },

  fn: async function ({ id }) {
    const formateur = await Formateur.findOne({ id });
    if (!formateur) throw 'notFound';
    if (formateur.status === 'active') throw 'alreadyActive';

    const crypto = require('crypto');

    // Generate new token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await Formateur.updateOne({ id }).set({
      invitationToken,
      invitationTokenExpiresAt
    });

    // Send email
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

      // Notify Admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Invitation renvoyée',
        content: `L'invitation pour le formateur ${formateur.prenom} ${formateur.nom} a été renvoyée.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Error sending admin notification:', err));

    } catch (e) {
      sails.log.error('Failed to resend invitation:', e);
    }

    return { message: 'Invitation renvoyée avec succès' };
  }
};
