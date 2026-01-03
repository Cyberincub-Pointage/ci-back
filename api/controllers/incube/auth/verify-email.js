module.exports = {
  friendlyName: 'Verify Email',
  description: 'Verify email address using a token.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Email verified successfully.'
    },
    invalidToken: {
      description: 'Invalid or expired token.',
      responseType: 'badRequest'
    }
  },

  fn: async function ({ token }) {
    const incube = await Incube.findOne({
      emailProofToken: token,
      emailProofTokenExpiresAt: { '>': Date.now() }
    });

    if (!incube) { throw 'invalidToken'; }

    await Incube.updateOne({ id: incube.id }).set({
      status: 'active',
      emailProofToken: '',
      emailProofTokenExpiresAt: 0
    });

    return {
      message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.'
    };
  }
};
