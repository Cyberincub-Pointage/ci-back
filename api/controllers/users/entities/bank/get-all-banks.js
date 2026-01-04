module.exports = {
  friendlyName: 'Obtenir toutes les banques',
  description: 'Récupérer la liste de toutes les banques.',
  inputs: {},
  exits: {
    success: {
      description: 'Liste des banques récupérée avec succès.'
    }
  },
  fn: async function () {
    const banks = await Banque.find();
    return banks;
  }
};
