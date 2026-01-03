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
    const admin = await Admin.findOne({ invitationToken: token });

    if (!admin) throw 'invalidToken';
    if (admin.invitationTokenExpiresAt < Date.now()) throw 'invalidToken';

    return {
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email
    };
  }
};
