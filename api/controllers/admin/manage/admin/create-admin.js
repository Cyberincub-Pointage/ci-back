module.exports = {
  friendlyName: 'Créer un administrateur',
  description: 'Inviter un nouvel administrateur.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    nom: {
      type: 'string',
      required: true
    },
    prenom: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      isIn: ['admin', 'super_admin'],
      defaultsTo: 'admin'
    }
  },

  exits: {
    success: {
      description: 'Administrateur invité avec succès.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'adresse email fournie est déjà utilisée.',
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function ({ email, nom, prenom, role }) {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    // Seul le super_admin peut inviter de nouveaux administrateurs
    if (this.req.me.role !== 'super_admin') {
      throw 'forbidden';
    }

    // Générer le jeton d'invitation
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Générer un mot de passe temporaire aléatoire
    const randomPassword = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newAdmin = await Admin.create({
      email: email.toLowerCase(),
      nom,
      prenom,
      role: role,
      password: hashedPassword,
      status: 'pending',
      invitationToken: invitationToken,
      invitationTokenExpiresAt: invitationTokenExpiresAt
    })
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .fetch();

    try {
      // Récupérer les détails de l'invitant
      const inviter = await Admin.findOne({ id: this.req.me.id });
      const inviterName = inviter ? `${inviter.prenom} ${inviter.nom}` : 'Un administrateur';

      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'admin/invite',
        to: email,
        subject: 'Invitation à rejoindre l\'administration CI',
        appSlug: 'ci',
        templateData: {
          firstName: prenom,
          inviterName: inviterName,
          role: role,
          invitationLink: `${appUrls}/auth/invite-admin?token=${invitationToken}`,
          expirationDelay: '24 heures'
        }
      });

      // Notifier l'Administrateur
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Admin ajouté',
        content: `L'administrateur ${prenom} ${nom} a été invité avec succès.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email d\'invitation :', error);
    }

    return newAdmin;
  }
};
