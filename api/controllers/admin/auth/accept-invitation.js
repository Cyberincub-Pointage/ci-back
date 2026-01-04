module.exports = {
  friendlyName: 'Accepter l\'invitation',
  description: 'Accepter une invitation pour rejoindre en tant qu\'Administrateur, définir le mot de passe et mettre à jour les détails.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'Le jeton d\'invitation reçu par email.'
    },
    password: {
      type: 'string',
      required: true,
      description: 'Le nouveau mot de passe pour le compte.'
    },
    nom: {
      type: 'string',
      required: true
    },
    prenom: {
      type: 'string',
      required: true
    },
    photoUrl: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Invitation acceptée avec succès. L\'utilisateur est connecté.',
    },
    invalidToken: {
      description: 'Le jeton est invalide ou expiré.',
      responseType: 'badRequest'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'adresse email fournie est déjà utilisée.',
    },
  },

  fn: async function ({ token, password, nom, prenom, photoUrl }) {
    // Trouver l'Administrateur avec le jeton correspondant
    const admin = await Admin.findOne({
      invitationToken: token
    });

    if (!admin) {
      throw 'invalidToken';
    }

    // Vérifier l'expiration du jeton
    if (admin.invitationTokenExpiresAt < Date.now()) {
      throw 'invalidToken';
    }

    // Mettre à jour l'Administrateur
    await Admin.updateOne({ id: admin.id })
      .set({
        password: password,
        nom,
        prenom,
        photoUrl,
        status: 'active',
        invitationToken: '',
        invitationTokenExpiresAt: 0,
      });

    // Générer le JWT pour la connexion automatique
    const jwtToken = await sails.helpers.generateJwt({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Notifier tous les super_admin
    try {
      const superAdmins = await Admin.find({ role: 'super_admin', status: 'active' });
      const acceptedAt = new Date().toLocaleString('fr-FR');

      for (const superAdmin of superAdmins) {
        // Envoyer l'email
        try {
          await sails.helpers.sender.email.with({
            layout: 'default-layout',
            template: 'admin/invite-admin-accept',
            to: superAdmin.email,
            subject: 'Nouvel administrateur activé - CyberIncub',
            appSlug: 'ci',
            templateData: {
              adminName: `${prenom} ${nom}`,
              adminEmail: admin.email,
              adminRole: admin.role,
              acceptedAt: acceptedAt
            }
          });
        } catch (emailErr) {
          sails.log.error('Failed to send admin acceptance email:', emailErr);
        }

        // Envoyer une notification
        try {
          await sails.helpers.sender.notification.with({
            recipientId: superAdmin.id,
            model: 'admin',
            app: 'ci',
            title: 'Nouvel administrateur activé',
            content: `${prenom} ${nom} (${admin.role}) a accepté son invitation et activé son compte.`,
            priority: 'normal',
            isForAdmin: true
          });
        } catch (notifErr) {
          sails.log.error('Échec de l\'envoi de la notification d\'acceptation admin :', notifErr);
        }
      }
    } catch (err) {
      sails.log.error('Erreur lors de la notification des super admins :', err);
    }

    // Retourner le succès avec le jeton et les infos utilisateur
    return {
      token: jwtToken,
      user: {
        id: admin.id,
        email: admin.email,
        nom,
        prenom,
        role: admin.role,
        status: 'active',
        photoUrl: admin.photoUrl || photoUrl
      }
    };
  }
};
