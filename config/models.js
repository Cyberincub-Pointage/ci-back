module.exports.models = {

  migrate: 'safe',
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
      type: 'number',
      autoIncrement: true,
    },
  },

  dataEncryptionKeys: {
    default: 'pMICFoNa97LtXpn14tQv05W2p3xo5FjQQ93VFIMHglY='
  },

  cascadeOnDestroy: true
};
