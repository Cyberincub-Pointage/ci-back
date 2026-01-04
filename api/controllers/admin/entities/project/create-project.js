module.exports = {
  friendlyName: 'Créer un projet',
  description: 'Créer un nouveau projet.',

  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom du projet.'
    },
    description: {
      type: 'string',
      description: 'Une brève description du projet.'
    },
    equipe: {
      type: 'string',
      description: 'L\'ID de l\'équipe travaillant sur ce projet.'
    }
  },

  exits: {
    success: {
      description: 'Projet créé avec succès.'
    }
  },

  fn: async function ({ nom, description, equipe }) {
    const newProject = await Projet.create({ nom, description, equipe }).fetch();

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet créé',
      content: `Le projet ${nom} a été créé.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return newProject;
  }
};
