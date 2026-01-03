module.exports = {
  friendlyName: 'Create Project',
  description: 'Create a new project.',
  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'The name of the project.'
    },
    description: {
      type: 'string',
      description: 'A brief description of the project.'
    },
    equipe: {
      type: 'string',
      description: 'The ID of the team working on this project.'
    }
  },
  exits: {
    success: {
      description: 'Project created successfully.'
    }
  },
  fn: async function ({ nom, description, equipe }) {
    const newProject = await Projet.create({ nom, description, equipe }).fetch();

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet créé',
      content: `Le projet ${nom} a été créé.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return newProject;
  }
};
