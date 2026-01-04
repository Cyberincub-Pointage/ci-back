module.exports = {
  friendlyName: 'Mettre à jour une banque',
  description: 'Mettre à jour une banque existante.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de la banque à mettre à jour.'
    },
    nom: {
      type: 'string',
      description: 'Le nouveau nom de la banque.'
    },
    code: {
      type: 'string',
      description: 'Le nouveau code unique de la banque.'
    }
  },

  exits: {
    success: {
      description: 'Banque mise à jour avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Banque non trouvée.'
    },
    codeAlreadyInUse: {
      statusCode: 409,
      description: 'Le code de banque fourni est déjà utilisé.'
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

    // Changements
    let changes = [];
    if (oldBank.nom !== updatedBank.nom) {
      changes.push(`Nom: "${oldBank.nom}" -> "${updatedBank.nom}"`);
    }
    if (oldBank.code !== updatedBank.code) {
      changes.push(`Code: "${oldBank.code}" -> "${updatedBank.code}"`);
    }

    const changesText = changes.length > 0 ? ` Modifications : ${changes.join(', ')}.` : ' Aucune modification détectée.';

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Banque mise à jour',
      content: `La banque "${oldBank.nom}" (${oldBank.code}) a été mise à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return updatedBank;
  }
};
