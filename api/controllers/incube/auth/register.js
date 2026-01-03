module.exports = {
  friendlyName: 'Register',
  description: 'Register a new Incube.',

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
      description: 'Registration successful. Verification email sent.'
    },
    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email is already in use.'
    }
  },

  fn: async function ({ email, password, nom, prenom, telephone }) {
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');

    const emailProofToken = crypto.randomBytes(32).toString('hex');
    const emailProofTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    try {
      await sails.helpers.utils.validatePassword(password, 'incube');
    } catch (err) {
      if (err.invalid) {
        throw new Error(err.invalid);
      }
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newIncube = await Incube.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      status: 'pending',
      emailProofToken,
      emailProofTokenExpiresAt
    })
      .intercept('E_UNIQUE', 'emailAlreadyInUse')
      .fetch();

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
      sails.log.error('Failed to send verification email to new incube:', error);
    }

    return {
      message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.'
    };
  }
};
