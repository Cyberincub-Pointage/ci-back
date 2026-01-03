module.exports = {
  friendlyName: 'Get Invitation Info',
  description: 'Get basic user info associated with an invitation token.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Info retrieved.'
    },
    invalidToken: {
      description: 'Token invalid or expired.',
      responseType: 'badRequest'
    }
  },

  fn: async function ({ token }) {
    const formateur = await Formateur.findOne({ invitationToken: token });

    if (!formateur) throw 'invalidToken';
    if (formateur.invitationTokenExpiresAt < Date.now()) throw 'invalidToken';

    return {
      nom: formateur.nom,
      prenom: formateur.prenom
    };
  }
};
