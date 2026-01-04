module.exports = {
  friendlyName: 'Obtenir les infos d\'invitation',
  description: 'Obtenir les informations de base de l\'utilisateur associées à un jeton d\'invitation.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Infos récupérées.'
    },
    invalidToken: {
      description: 'Jeton invalide ou expiré.',
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
