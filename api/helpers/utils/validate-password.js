module.exports = {
  friendlyName: 'Validate password',
  description: 'Validate password strength based on user role.',

  inputs: {
    password: {
      type: 'string',
      required: true,
      description: 'The password to validate.'
    },
    role: {
      type: 'string',
      defaultsTo: 'incube',
      isIn: ['admin', 'formateur', 'incube'],
      description: 'The role of the user to determine validation criteria.'
    }
  },

  exits: {
    success: {
      description: 'Password is valid.'
    },
    invalid: {
      description: 'Password does not meet the criteria.'
    }
  },

  fn: async function (inputs, exits) {
    const { password, role } = inputs;
    let isValid = false;
    let message = '';

    // Regex parts
    const upper = /[A-Z]/g;
    const lower = /[a-z]/g;
    const digit = /\d/g;
    const special = /[^A-Za-z0-9]/g;

    const counts = {
      upper: (password.match(upper) || []).length,
      lower: (password.match(lower) || []).length,
      digit: (password.match(digit) || []).length,
      special: (password.match(special) || []).length
    };

    switch (role) {
      case 'admin':
        // 12 chars, 2 upper, 2 lower, 2 digit, 2 special
        if (password.length >= 12 &&
          counts.upper >= 2 &&
          counts.lower >= 2 &&
          counts.digit >= 2 &&
          counts.special >= 2) {
          isValid = true;
        } else {
          message = 'Le mot de passe doit contenir au moins 12 caractères, avec 2 majuscules, 2 minuscules, 2 chiffres et 2 caractères spéciaux.';
        }
        break;

      case 'formateur':
        // 10 chars, 2 upper, 2 lower, 2 digit, 2 special
        if (password.length >= 10 &&
          counts.upper >= 2 &&
          counts.lower >= 2 &&
          counts.digit >= 2 &&
          counts.special >= 2) {
          isValid = true;
        } else {
          message = 'Le mot de passe doit contenir au moins 10 caractères, avec 2 majuscules, 2 minuscules, 2 chiffres et 2 caractères spéciaux.';
        }
        break;

      case 'incube':
      default:
        // 8 chars, 1 upper, 1 lower, 1 digit, 1 special
        if (password.length >= 8 &&
          counts.upper >= 1 &&
          counts.lower >= 1 &&
          counts.digit >= 1 &&
          counts.special >= 1) {
          isValid = true;
        } else {
          message = 'Le mot de passe doit contenir au moins 8 caractères, avec 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.';
        }
        break;
    }

    if (!isValid) {
      throw { invalid: message };
    }

    return exits.success();
  }
};
