module.exports = {
  friendlyName: 'Obtenir une banque',
  description: 'Récupérer les détails d\'une banque spécifique.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de la banque à récupérer.'
    }
  },
  exits: {
    success: {
      description: 'Détails de la banque récupérés avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Banque non trouvée.'
    }
  },
  fn: async function ({ id }) {
    const bank = await Banque.findOne({ id });

    if (!bank) {
      throw 'notFound';
    }

    // Population des incubés liés à cette banque
    const incubes = await Incube.find({ banque: id })
      .populate('equipe')
      .populate('projet')
      .populate('banque');

    // Attacher les incubés à l'objet banque
    bank.incubes = incubes;

    return bank;
  }
};
