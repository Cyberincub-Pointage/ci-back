module.exports = {
  friendlyName: 'Format phone number',
  description: 'Validate and format a phone number to the strict format +22901xxxxxxxx.',

  inputs: {
    phoneNumber: {
      type: 'string',
      required: true,
      description: 'The phone number to format.'
    }
  },

  exits: {
    success: {
      description: 'Phone number is valid and formatted.'
    },
    invalidFormat: {
      description: 'The phone number format is invalid.'
    }
  },

  fn: async function (inputs) {
    const { phoneNumber } = inputs;

    // Remove any whitespace
    const cleanedNumber = phoneNumber.replace(/\s+/g, '');

    // Regex explanation:
    // ^(?:\+229)? : Optional +229 prefix (non-capturing group)
    // (01\d{8})$ : Mandatory 01 followed by exactly 8 digits. This group is captured.
    const regex = /^(?:\+229)?(01\d{8})$/;
    const match = cleanedNumber.match(regex);

    if (!match) {
      throw 'invalidFormat';
    }

    // match[1] contains the part starting with 01...
    // We strictly prepend +229 to it.
    const formattedNumber = `+229${match[1]}`;

    return formattedNumber;
  }
};
