module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'L\'adresse email unique de l\'administrateur.'
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Le mot de passe hashé de l\'administrateur.'
    },
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de famille de l\'administrateur.'
    },
    prenom: {
      type: 'string',
      required: true,
      description: 'Le prénom de l\'administrateur.'
    },
    telephone: {
      type: 'string',
      description: 'Le numéro de téléphone de l\'administrateur.'
    },
    role: {
      type: 'string',
      isIn: ['admin', 'super_admin'],
      defaultsTo: 'admin',
      description: 'Le rôle de l\'administrateur (admin ou super_admin).'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      defaultsTo: 'pending',
      description: 'Le statut du compte administrateur (en attente, actif, suspendu).'
    },
    invitationToken: {
      type: 'string',
      protect: true,
      description: 'Le token d\'invitation pour l\'activation du compte.'
    },
    invitationTokenExpiresAt: {
      type: 'number',
      description: 'La date d\'expiration du token d\'invitation (timestamp).'
    },
    passwordResetToken: {
      type: 'string',
      description: 'Token pour la réinitialisation du mot de passe.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de réinitialisation.'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil de l\'administrateur.'
    }
  },

  // Lifecycle avant la création
  beforeCreate: async function (valuesToSet, proceed) {
    if (valuesToSet.telephone) {
      try {
        valuesToSet.telephone = await sails.helpers.utils.formatPhoneNumber(valuesToSet.telephone);
      } catch (err) {
        return proceed(err);
      }
    }

    if (valuesToSet.password) {
      try {
        await sails.helpers.utils.validatePassword(valuesToSet.password, 'admin');
        const bcrypt = require('bcryptjs');
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
      } catch (err) {
        if (err.invalid) {
          return proceed(new Error(err.invalid));
        }
        return proceed(err);
      }
    }
    return proceed();
  },

  beforeUpdate: async function (valuesToSet, proceed) {
    if (valuesToSet.telephone) {
      try {
        valuesToSet.telephone = await sails.helpers.utils.formatPhoneNumber(valuesToSet.telephone);
      } catch (err) {
        return proceed(err);
      }
    }

    if (valuesToSet.password) {
      try {
        await sails.helpers.utils.validatePassword(valuesToSet.password, 'admin');
        const bcrypt = require('bcryptjs');
        valuesToSet.password = await bcrypt.hash(valuesToSet.password, 10);
      } catch (err) {
        if (err.invalid) {
          return proceed(new Error(err.invalid));
        }
        return proceed(err);
      }
    }
    return proceed();
  },

  customToJSON: function () {
    return _.omit(this, ['password']);
  }
};
