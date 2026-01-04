module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'L\'adresse email unique du formateur.'
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Le mot de passe hashé du formateur.'
    },
    nom: {
      type: 'string',
      description: 'Le nom de famille du formateur.'
    },
    prenom: {
      type: 'string',
      description: 'Le prénom du formateur.'
    },
    telephone: {
      type: 'string',
      description: 'Le numéro de téléphone du formateur.'
    },
    role: {
      type: 'string',
      isIn: ['formateur', 'formateur_principal'],
      defaultsTo: 'formateur',
      description: 'Le rôle du formateur (simple ou principal).'
    },
    specialite: {
      type: 'string',
      description: 'La spécialité technique du formateur.'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil du formateur.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      defaultsTo: 'pending',
      description: 'Le statut du compte formateur (en attente, actif, suspendu).'
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
    equipes: {
      collection: 'equipe',
      via: 'formateur',
      description: 'Les équipes gérées par ce formateur.'
    },
    validations: {
      collection: 'presence',
      via: 'validatedBy',
      description: 'Les présences validées par ce formateur.'
    },
    processedPermissions: {
      collection: 'permissionrequest',
      via: 'processedBy',
      description: 'Les permissions traitées par ce formateur.'
    },
    passwordResetToken: {
      type: 'string',
      description: 'Token pour la réinitialisation du mot de passe.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de réinitialisation.'
    }
  },

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
        await sails.helpers.utils.validatePassword(valuesToSet.password, 'formateur');
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
        await sails.helpers.utils.validatePassword(valuesToSet.password, 'formateur');
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
