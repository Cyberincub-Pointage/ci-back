module.exports = {
  friendlyName: 'Create Bank',
  description: 'Create a new bank.',
  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'The name of the bank.'
    },
    code: {
      type: 'string',
      required: true,
      description: 'The unique code for the bank.'
    }
  },
  exits: {
    success: {
      description: 'Bank created successfully.'
    },
    codeAlreadyInUse: {
      statusCode: 409,
      description: 'The provided bank code is already in use.'
    }
  },
  fn: async function ({ nom, code }) {
    const newBank = await Banque.create({ nom, code })
      .intercept('E_UNIQUE', 'codeAlreadyInUse')
      .fetch();

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque créée',
      content: `La banque ${nom} (${code}) a été créée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return newBank;
  }
};
