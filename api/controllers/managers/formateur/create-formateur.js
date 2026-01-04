module.exports = {
  friendlyName: 'Créer un formateur',
  description: 'Créer un nouveau formateur.',
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
      isIn: ['formateur', 'formateur_principal'],
      defaultsTo: 'formateur_principal'
    }
  },
  exits: {
    success: {
      description: 'Formateur créé avec succès.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'adresse email fournie est déjà utilisée.',
    },
  },
  fn: async function ({ email, nom, prenom, role }) {
    const crypto = require('crypto');
    // const bcrypt = require('bcryptjs');

    // Générer le token d'invitation
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    // Générer un mot de passe temporaire
    const basePassword = crypto.randomBytes(10).toString('hex');
    const compliantPassword = 'AB!@' + basePassword + '12';

    const newFormateur = await Formateur.create({
      email: email.toLowerCase(),
      nom,
      prenom,
      role: role,
      password: compliantPassword,
      status: 'pending',
      invitationToken: invitationToken,
      invitationTokenExpiresAt: invitationTokenExpiresAt
    })
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .fetch();

    // Envoyer l'email d'invitation
    try {
      // Récupérer les détails de l'admin pour obtenir le nom
      const admin = await Admin.findOne({ id: this.req.me.id });
      const inviterName = admin ? `${admin.prenom} ${admin.nom}` : 'Un administrateur';
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'formateur/invite',
        to: email,
        subject: 'Invitation à rejoindre l\'administration CI',
        appSlug: 'ci',
        templateData: {
          firstName: prenom,
          inviterName: inviterName,
          role: role,
          invitationLink: `${appUrls}/auth/invite-form?token=${invitationToken}`,
          expirationDelay: '24 heures'
        }
      });

      // Notifier l'admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Formateur ajouté',
        content: `Le formateur ${prenom} ${nom} a été ajouté avec succès.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification à l\'admin :', err));

    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email d\'invitation :', error);
    }

    return newFormateur;
  }
};
