module.exports.models = {

  migrate: 'alter',
  attributes: {
    createdAt: {
      type: 'number',
      autoCreatedAt: true,
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true,
    },
    id: {
      type: 'string',
      required: true,
    },
  },

  // Callback de cycle de vie pour générer des ULID avant la création
  beforeCreate: function (values, proceed) {
    const { ulid } = require('ulid');
    if (!values.id) {
      values.id = ulid();
    }
    return proceed();
  },

  dataEncryptionKeys: {
    default: 'pMICFoNa97LtXpn14tQv05W2p3xo5FjQQ93VFIMHglY='
  },

  cascadeOnDestroy: true
};
