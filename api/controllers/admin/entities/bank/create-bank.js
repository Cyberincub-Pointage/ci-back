module.exports = {
  friendlyName: 'Créer une banque',
  description: 'Créer une nouvelle banque.',

  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de la banque.'
    },
    code: {
      type: 'string',
      required: true,
      description: 'Le code unique de la banque.'
    }
  },

  exits: {
    success: {
      description: 'Banque créée avec succès.'
    },
    codeAlreadyInUse: {
      statusCode: 409,
      description: 'Le code de banque fourni est déjà utilisé.'
    }
  },

  fn: async function ({ nom, code }) {
    const newBank = await Banque.create({ nom, code })
      .intercept('E_UNIQUE', 'codeAlreadyInUse')
      .fetch();

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque créée',
      content: `La banque ${nom} (${code}) a été créée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return newBank;
  }
};
