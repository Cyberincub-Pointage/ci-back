module.exports = {
  friendlyName: 'Créer une équipe',
  description: 'Créer une nouvelle équipe.',

  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de l\'équipe.'
    },
    description: {
      type: 'string',
      description: 'Une brève description de l\'équipe.'
    },
    formateur: {
      type: 'string',
      description: 'L\'ID du formateur responsable.'
    }
  },

  exits: {
    success: {
      description: 'Équipe créée avec succès.'
    }
  },

  fn: async function ({ nom, description, formateur }) {
    const newTeam = await Equipe.create({ nom, description, formateur }).fetch();

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe créée',
      content: `L'équipe ${nom} a été créée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return newTeam;
  }
};
