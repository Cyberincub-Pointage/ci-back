module.exports = {
  friendlyName: 'Resend Invitation',
  description: 'Resend invitation email to a pending admin.',

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
    const adminTarget = await Admin.findOne({ id });
    if (!adminTarget) throw 'notFound';
    if (adminTarget.status === 'active') throw 'alreadyActive';

    const crypto = require('crypto');

    // Generate new token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await Admin.updateOne({ id }).set({
      invitationToken,
      invitationTokenExpiresAt
    });

    // Send email
    try {
      const adminInviter = await Admin.findOne({ id: this.req.me.id });
      const inviterName = adminInviter ? `${adminInviter.prenom} ${adminInviter.nom}` : 'Un administrateur';
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'admin/invite',
        to: adminTarget.email,
        subject: 'Relance : Invitation à rejoindre l\'administration CI',
        appSlug: 'ci',
        templateData: {
          firstName: adminTarget.prenom,
          inviterName: inviterName,
          role: adminTarget.role,
          invitationLink: `${appUrls}/auth/invite-admin?token=${invitationToken}`,
          expirationDelay: '24 heures'
        }
      });

      // Notify Admin (Me) that I resent it
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Invitation renvoyée',
        content: `L'invitation pour l'administrateur ${adminTarget.prenom} ${adminTarget.nom} a été renvoyée.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Error sending admin notification:', err));

    } catch (e) {
      sails.log.error('Failed to resend invitation:', e);
    }

    return { message: 'Invitation renvoyée avec succès' };
  }
};
