module.exports = {
  friendlyName: 'Accept Invitation',
  description: 'Accept an invitation to join as an Admin, setting password and updating details.',

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
    photoUrl: {
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

  fn: async function ({ token, password, nom, prenom, photoUrl }) {
    // 1. Find the Admin with the matching token
    const admin = await Admin.findOne({
      invitationToken: token
    });

    if (!admin) {
      throw 'invalidToken'; // Token not found
    }

    // 2. Check for token expiration
    if (admin.invitationTokenExpiresAt < Date.now()) {
      throw 'invalidToken'; // Token expired
    }

    // 3. Update the Admin
    const bcrypt = require('bcryptjs');

    try {
      await sails.helpers.utils.validatePassword(password, 'admin');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.updateOne({ id: admin.id })
      .set({
        password: hashedPassword,
        nom,
        prenom,
        photoUrl,
        status: 'active',
        invitationToken: '',     // Clear the token
        invitationTokenExpiresAt: 0 // Clear expiration
      });

    // 4. Generate JWT for auto-login
    const jwtToken = await sails.helpers.generateJwt({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // 5. Notify all super_admin
    try {
      const superAdmins = await Admin.find({ role: 'super_admin', status: 'active' });
      const acceptedAt = new Date().toLocaleString('fr-FR');

      for (const superAdmin of superAdmins) {
        // Send email
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

        // Send notification
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
          sails.log.error('Failed to send admin acceptance notification:', notifErr);
        }
      }
    } catch (err) {
      sails.log.error('Error notifying super admins:', err);
    }

    // 6. Return success with token and user info
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
