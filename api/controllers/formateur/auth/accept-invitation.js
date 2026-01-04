module.exports = {
  friendlyName: 'Accepter l\'invitation',
  description: 'Accepter une invitation à rejoindre en tant que Formateur, définir le mot de passe et mettre à jour les détails.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'Le jeton d\'invitation provenant de l\'email.'
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
    telephone: {
      type: 'string'
    },
    specialite: {
      type: 'string'
    }
  },

  exits: {
    success: {
      description: 'Invitation acceptée avec succès. L\'utilisateur est connecté.',
    },
    invalidToken: {
      description: 'Le jeton est invalide ou expiré.',
      statusCode: 400
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'email fourni est déjà utilisé.',
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.'
    }
  },

  fn: async function ({ token, password, nom, prenom, telephone, specialite }) {
    // Trouver le Formateur avec le jeton correspondant
    const formateur = await Formateur.findOne({
      invitationToken: token
    });

    if (!formateur) {
      throw { invalidToken: 'Le jeton d\'invitation est invalide ou expiré.' };
    }

    // Vérifier l'expiration du jeton
    if (formateur.invitationTokenExpiresAt < Date.now()) {
      throw { invalidToken: 'Le jeton d\'invitation est invalide ou expiré.' };
    }

    // Mettre à jour le Formateur
    try {
      await Formateur.updateOne({ id: formateur.id })
        .set({
          password: password,
          nom,
          prenom,
          specialite,
          status: 'active',
          invitationToken: '',
          invitationTokenExpiresAt: 0,
        });
    } catch (err) {
      if (err.message) {
        if (err.message.includes('Le mot de passe doit contenir') || (err.invalid && err.invalid.includes('Le mot de passe'))) {
          const msg = err.invalid || err.message;
          if (msg.includes('Le mot de passe doit contenir')) {
            throw { passwordFormatInvalid: msg.includes('Error: ') ? msg.split('Error: ')[1] : msg };
          }
        }
        if (err.raw && err.raw.invalid) {
          throw { passwordFormatInvalid: err.raw.invalid };
        }
      }

      if (err.invalid) {
        throw { passwordFormatInvalid: err.invalid };
      }
      throw err;
    }

    // Générer le JWT pour la connexion automatique
    const jwtToken = await sails.helpers.generateJwt({
      id: formateur.id,
      email: formateur.email,
      role: formateur.role
    });

    // Notifier le super_admin et l'invitant
    try {
      const superAdmins = await Admin.find({ role: 'super_admin', status: 'active' });
      const acceptedAt = new Date().toLocaleString('fr-FR');

      // Notifier tous les super_admin
      for (const superAdmin of superAdmins) {
        // Send email
        try {
          await sails.helpers.sender.email.with({
            layout: 'default-layout',
            template: 'admin/invite-formateur-accept',
            to: superAdmin.email,
            subject: 'Nouveau formateur activé - CyberIncub',
            appSlug: 'ci',
            templateData: {
              formateurName: `${prenom} ${nom}`,
              formateurEmail: formateur.email,
              specialite: specialite || 'Non spécifiée',
              acceptedAt: acceptedAt
            }
          });
        } catch (emailErr) {
          sails.log.error('Échec de l\'envoi de l\'email d\'acceptation formateur au super_admin :', emailErr);
        }

        // Send notification
        try {
          await sails.helpers.sender.notification.with({
            recipientId: superAdmin.id,
            model: 'admin',
            app: 'ci',
            title: 'Nouveau formateur activé',
            content: `${prenom} ${nom} a accepté son invitation et activé son compte formateur.`,
            priority: 'normal',
            isForAdmin: true
          });
        } catch (notifErr) {
          sails.log.error('Échec de l\'envoi de la notification d\'acceptation formateur :', notifErr);
        }
      }

    } catch (err) {
      sails.log.error('Erreur lors de la notification de l\'acceptation formateur :', err);
    }

    // Retourner le succès avec le jeton et les infos utilisateur
    return {
      token: jwtToken,
      user: {
        id: formateur.id,
        email: formateur.email,
        nom,
        prenom,
        role: formateur.role,
        status: 'active'
      }
    };
  }
};
