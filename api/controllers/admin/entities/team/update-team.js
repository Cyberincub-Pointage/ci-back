module.exports = {
  friendlyName: 'Update Team',
  description: 'Update an existing team.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the team to update.'
    },
    nom: {
      type: 'string',
      description: 'The new name of the team.'
    },
    description: {
      type: 'string',
      description: 'The new description of the team.'
    },
    formateur: {
      type: 'string',
      description: 'The ID of the new responsible formateur.'
    }
  },
  exits: {
    success: {
      description: 'Team updated successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Team not found.'
    }
  },
  fn: async function ({ id, nom, description, formateur }) {
    const oldTeam = await Equipe.findOne({ id });
    if (!oldTeam) {
      throw 'notFound';
    }

    const updatedTeam = await Equipe.updateOne({ id })
      .set({ nom, description, formateur });

    // Calculate changes
    let changes = [];
    if (nom && oldTeam.nom !== updatedTeam.nom) {
      changes.push(`Nom: "${oldTeam.nom}" -> "${updatedTeam.nom}"`);
    }
    if (description && oldTeam.description !== updatedTeam.description) {
      const oldDesc = oldTeam.description ? (oldTeam.description.length > 20 ? oldTeam.description.substring(0, 20) + '...' : oldTeam.description) : 'Vide';
      const newDesc = updatedTeam.description ? (updatedTeam.description.length > 20 ? updatedTeam.description.substring(0, 20) + '...' : updatedTeam.description) : 'Vide';
      changes.push(`Description: "${oldDesc}" -> "${newDesc}"`);
    }
    if (formateur && oldTeam.formateur !== updatedTeam.formateur) {
      changes.push(`Formateur: "${oldTeam.formateur || 'Aucun'}" -> "${updatedTeam.formateur}"`);
    }

    const changesText = changes.length > 0 ? ` Modifications : ${changes.join(', ')}.` : ' Aucune modification détectée.';

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe mise à jour',
      content: `L'équipe "${oldTeam.nom}" a été mise à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedTeam;
  }
};
