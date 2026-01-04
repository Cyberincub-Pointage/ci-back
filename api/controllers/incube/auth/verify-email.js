module.exports = {
  friendlyName: 'Vérifier l\'email',
  description: 'Vérifier l\'adresse email en utilisant un token.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Email vérifié avec succès.'
    },
    invalidToken: {
      description: 'Token invalide ou expiré.',
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
