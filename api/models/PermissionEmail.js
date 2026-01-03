module.exports = {

  attributes: {
    value: {
      type: 'string',
      // defaultsTo: 'steveasterafovo@gmail.com',
      description: 'Email de réception des demandes de permission'
    }
  },

  beforeCreate: function (valuesToSet, proceed) {
    if (typeof valuesToSet.value === 'undefined') {
      valuesToSet.value = sails.config.custom.permissionEmail || 'Non trouvé';
    }
    return proceed();
  },
};
