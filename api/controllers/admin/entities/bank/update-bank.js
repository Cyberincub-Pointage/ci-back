module.exports = {
  friendlyName: 'Update Bank',
  description: 'Update an existing bank.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the bank to update.'
    },
    nom: {
      type: 'string',
      description: 'The new name of the bank.'
    },
    code: {
      type: 'string',
      description: 'The new unique code for the bank.'
    }
  },
  exits: {
    success: {
      description: 'Bank updated successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Bank not found.'
    },
    codeAlreadyInUse: {
      statusCode: 409,
      description: 'The provided bank code is already in use.'
    }
  },
  fn: async function ({ id, nom, code }) {
    const oldBank = await Banque.findOne({ id });
    if (!oldBank) {
      throw 'notFound';
    }

    const updatedBank = await Banque.updateOne({ id })
      .set({ nom, code })
      .intercept('E_UNIQUE', 'codeAlreadyInUse');

    // Calculate changes
    let changes = [];
    if (oldBank.nom !== updatedBank.nom) {
      changes.push(`Nom: "${oldBank.nom}" -> "${updatedBank.nom}"`);
    }
    if (oldBank.code !== updatedBank.code) {
      changes.push(`Code: "${oldBank.code}" -> "${updatedBank.code}"`);
    }

    const changesText = changes.length > 0 ? ` Modifications : ${changes.join(', ')}.` : ' Aucune modification détectée.';

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque mise à jour',
      content: `La banque "${oldBank.nom}" (${oldBank.code}) a été mise à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedBank;
  }
};
