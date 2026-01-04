module.exports = {
  friendlyName: 'Infos de l\'invitation',
  description: 'Obtenir les informations utilisateur associées à un jeton d\'invitation.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Informations récupérées.'
    },
    invalidToken: {
      description: 'Jeton invalide ou expiré.',
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
