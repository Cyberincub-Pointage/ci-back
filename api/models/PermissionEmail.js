module.exports = {

  attributes: {
    value: {
      type: 'string',
      // defaultsTo: 'steveasterafovo@gmail.com',
      description: 'Email de réception des demandes de permission'
    }
  },

  beforeCreate: function (valuesToSet, proceed) {
    const { ulid } = require('ulid');

    // Générer un ULID si l'id n'est pas fourni
    if (!valuesToSet.id) {
      valuesToSet.id = ulid();
    }

    // Définir la valeur par défaut si non fournie
    if (typeof valuesToSet.value === 'undefined') {
      valuesToSet.value = sails.config.custom.permissionEmail || 'Non trouvé';
    }
    return proceed();
  },
};
