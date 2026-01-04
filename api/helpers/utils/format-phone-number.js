module.exports = {
  friendlyName: 'Formater le numéro de téléphone',
  description: 'Valider et formater un numéro de téléphone au format strict +22901xxxxxxxx.',

  inputs: {
    phoneNumber: {
      type: 'string',
      required: true,
      description: 'Le numéro de téléphone à formater.'
    }
  },

  exits: {
    success: {
      description: 'Le numéro de téléphone est valide et formaté.'
    },
    invalidFormat: {
      description: 'Le format du numéro de téléphone est invalide.'
    }
  },

  fn: async function (inputs) {
    const { phoneNumber } = inputs;

    // Supprimer les espaces
    const cleanedNumber = phoneNumber.replace(/\s+/g, '');

    // ^(?:\+229)? : Préfixe optionnel +229 (groupe non capturant)
    // (01\d{8})$ : 01 obligatoire suivi de exactement 8 chiffres. Ce groupe est capturé.
    const regex = /^(?:\+229)?(01\d{8})$/;
    const match = cleanedNumber.match(regex);

    if (!match) {
      throw 'invalidFormat';
    }

    // Nous ajoutons strictement +229 devant.
    const formattedNumber = `+229${match[1]}`;

    return formattedNumber;
  }
};
