module.exports = {
  friendlyName: 'Create Team',
  description: 'Create a new team.',
  inputs: {
    nom: {
      type: 'string',
      required: true,
      description: 'The name of the team.'
    },
    description: {
      type: 'string',
      description: 'A brief description of the team.'
    },
    formateur: {
      type: 'string',
      description: 'The ID of the responsible formateur.'
    }
  },
  exits: {
    success: {
      description: 'Team created successfully.'
    }
  },
  fn: async function ({ nom, description, formateur }) {
    const newTeam = await Equipe.create({ nom, description, formateur }).fetch();

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe créée',
      content: `L'équipe ${nom} a été créée.`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return newTeam;
  }
};
