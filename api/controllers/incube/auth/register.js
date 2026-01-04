module.exports = {
  friendlyName: 'Inscription',
  description: 'Inscrire un nouvel Incubé.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      type: 'string',
      required: true
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
    }
  },

  exits: {
    success: {
      description: 'Inscription réussie. Email de vérification envoyé.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'L\'email fourni est déjà utilisé.'
    },
    invalidPhoneFormat: {
      statusCode: 400,
      description: 'Le format du numéro de téléphone est invalide.'
    },
    passwordFormatInvalid: {
      statusCode: 400,
      description: 'Le format du mot de passe est invalide.'
    }
  },

  fn: async function ({ email, password, nom, prenom, telephone }) {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    const emailProofToken = crypto.randomBytes(32).toString('hex');
    const emailProofTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

    try {
      const newIncube = await Incube.create({
        email: email.toLowerCase(),
        password: password,
        nom,
        prenom,
        telephone,
        status: 'pending',
        emailProofToken,
        emailProofTokenExpiresAt
      }).fetch();
    } catch (err) {
      if (err.code === 'E_UNIQUE') {
        throw 'emailAlreadyInUse';
      }
      if (err.message) {
        if (err.message.includes('invalidFormat') || err.message.includes('The phone number format is invalid')) {
          throw { invalidPhoneFormat: 'Le format du numéro de téléphone est invalide.' };
        }
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

    try {
      const appUrls = sails.config.custom.appUrl;

      await sails.helpers.sender.email.with({
        layout: 'default-layout',
        template: 'incube/verify-email',
        to: email,
        subject: 'Vérifiez votre adresse email - CyberIncub',
        appSlug: 'ci',
        templateData: {
          firstName: prenom,
          verificationLink: `${appUrls}/auth/verify-email?token=${emailProofToken}`,
          expirationDelay: '24 heures'
        }
      });
    } catch (error) {
      sails.log.error('Échec de l\'envoi de l\'email de vérification au nouvel incubé :', error);
    }

    return {
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'
    };
  }
};
