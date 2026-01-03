const { ulid } = require('ulid');

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
      autoIncrement: true,
    },
  },

  beforeCreate: function (values, proceed) {
    console.log('Global beforeCreate triggered for:', values);
    if (!values.id) {
      values.id = ulid();
      console.log('Generated ULID:', values.id);
    }
    return proceed();
  },
  dataEncryptionKeys: {
    default: 'pMICFoNa97LtXpn14tQv05W2p3xo5FjQQ93VFIMHglY='
  },

  cascadeOnDestroy: true
};
