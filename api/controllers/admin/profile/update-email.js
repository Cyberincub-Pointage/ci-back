module.exports = {
  friendlyName: 'Update Email',
  description: 'Update the email of the logged-in Admin.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Email updated successfully.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },
    badCombo: {
      description: 'Incorrect password.',
      responseType: 'unauthorized'
    }
  },

  fn: async function ({ email, password }) {
    const bcrypt = require('bcryptjs');
    const admin = await Admin.findOne({ id: this.req.me.id });

    if (!admin) { throw 'badCombo'; }

    const passwordsMatch = await bcrypt.compare(password, admin.password);
    if (!passwordsMatch) { throw 'badCombo'; }

    try {
      const updatedAdmin = await Admin.updateOne({ id: this.req.me.id })
        .set({
          email: email.toLowerCase()
        });

      // Notify admin
      await sails.helpers.sender.notification.with({
        recipientId: this.req.me.id,
        model: 'admin',
        app: 'ci',
        title: 'Email mis à jour',
        content: `Votre adresse email a été mise à jour avec succès vers ${email.toLowerCase()}.`,
        priority: 'normal',
        isForAdmin: true
      }).catch(err => sails.log.error('Error sending update email notification:', err));

      return {
        message: 'Email mis à jour avec succès',
        user: {
          id: updatedAdmin.id,
          email: updatedAdmin.email,
          nom: updatedAdmin.nom,
          prenom: updatedAdmin.prenom,
          role: updatedAdmin.role,
          status: updatedAdmin.status,
          photoUrl: updatedAdmin.photoUrl
        }
      };

    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        throw 'emailAlreadyInUse';
      }
      throw err;
    }
  }
};
