module.exports = {
  friendlyName: 'Create Formateur',
  description: 'Create a new Formateur.',
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
      description: 'Formateur created successfully.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
  },
  fn: async function ({ email, nom, prenom, role }) {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Generate a temporary random password (will be reset by user)
    const randomPassword = crypto.randomBytes(10).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newFormateur = await Formateur.create({
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

    // Send invitation email
    try {
      // Fetch admin details to get the name
      const admin = await Admin.findOne({ id: this.req.me.id });
      const inviterName = admin ? `${admin.prenom} ${admin.nom}` : 'Un administrateur';

      // Ensure app config exists, fallback if testing
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

      // Notify Admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Formateur ajouté',
        content: `Le formateur ${prenom} ${nom} a été ajouté avec succès.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Error sending admin notification:', err));

    } catch (error) {
      sails.log.error('Failed to send invitation email:', error);
      // Note: User is created but email failed. Client might want to know.
    }

    return newFormateur;
  }
};
