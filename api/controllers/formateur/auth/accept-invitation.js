module.exports = {
  friendlyName: 'Accept Invitation',
  description: 'Accept an invitation to join as a Formateur, setting password and updating details.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The invitation token from the email.'
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
      description: 'The new password for the account.'
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
      description: 'Invitation accepted successfully. User is logged in.',
    },
    invalidToken: {
      description: 'The token is invalid or expired.',
      responseType: 'badRequest'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email is already in use.',
    },
  },

  fn: async function ({ token, password, nom, prenom, telephone, specialite }) {
    // 1. Find the Formateur with the matching token
    const formateur = await Formateur.findOne({
      invitationToken: token
    });

    if (!formateur) {
      throw 'invalidToken'; // Token not found
    }

    // 2. Check for token expiration
    if (formateur.invitationTokenExpiresAt < Date.now()) {
      throw 'invalidToken'; // Token expired
    }

    // 3. Update the Formateur
    const bcrypt = require('bcryptjs');

    try {
      await sails.helpers.utils.validatePassword(password, 'formateur');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Formateur.updateOne({ id: formateur.id })
      .set({
        password: hashedPassword,
        nom,
        prenom,
        telephone,
        specialite,
        status: 'active',
        invitationToken: '',     // Clear the token
        invitationTokenExpiresAt: 0 // Clear expiration
      });

    // 4. Generate JWT for auto-login
    const jwtToken = await sails.helpers.generateJwt({
      id: formateur.id,
      email: formateur.email, // Formateur model has email
      role: formateur.role
    });

    // 5. Notify super_admin and inviter
    try {
      const superAdmins = await Admin.find({ role: 'super_admin', status: 'active' });
      const acceptedAt = new Date().toLocaleString('fr-FR');

      // Notify all super_admin
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
          sails.log.error('Failed to send formateur acceptance email to super_admin:', emailErr);
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
          sails.log.error('Failed to send formateur acceptance notification:', notifErr);
        }
      }

      // TODO: Notify inviter if exists and is not admin
      // This would require storing invitedBy field in Formateur model

    } catch (err) {
      sails.log.error('Error notifying about formateur acceptance:', err);
    }

    // 6. Return success with token and user info
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
