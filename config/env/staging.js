module.exports = {
  datastores: {
    default: {},
  },

  models: {
    migrate: 'alter',
  },

  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {},
  },

  session: {
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  },

  log: {
    level: 'debug'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000,
  },

  custom: {},
};
