module.exports = {
  attributes: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de la banque.'
    },
    code: {
      type: 'string',
      required: true,
      unique: true,
      description: 'Le code unique identifiant la banque.'
    }
  }
};
