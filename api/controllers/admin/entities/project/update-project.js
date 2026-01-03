module.exports = {
  friendlyName: 'Update Project',
  description: 'Update an existing project.',
  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'The ID of the project to update.'
    },
    nom: {
      type: 'string',
      description: 'The new name of the project.'
    },
    description: {
      type: 'string',
      description: 'The new description of the project.'
    },
    equipe: {
      type: 'string',
      description: 'The ID of the new team associated with this project.'
    }
  },
  exits: {
    success: {
      description: 'Project updated successfully.'
    },
    notFound: {
      statusCode: 404,
      description: 'Project not found.'
    }
  },
  fn: async function ({ id, nom, description, equipe }) {
    const oldProject = await Projet.findOne({ id });
    if (!oldProject) {
      throw 'notFound';
    }

    const updatedProject = await Projet.updateOne({ id })
      .set({ nom, description, equipe });

    // Calculate changes
    let changes = [];
    if (nom && oldProject.nom !== updatedProject.nom) {
      changes.push(`Nom: "${oldProject.nom}" -> "${updatedProject.nom}"`);
    }
    if (description && oldProject.description !== updatedProject.description) {
      const oldDesc = oldProject.description ? (oldProject.description.length > 20 ? oldProject.description.substring(0, 20) + '...' : oldProject.description) : 'Vide';
      const newDesc = updatedProject.description ? (updatedProject.description.length > 20 ? updatedProject.description.substring(0, 20) + '...' : updatedProject.description) : 'Vide';
      changes.push(`Description: "${oldDesc}" -> "${newDesc}"`);
    }
    if (equipe && oldProject.equipe !== updatedProject.equipe) {
      // Ideally we would fetch team names, but let's stick to IDs or simple change indication for now to save DB calls, or fetch if critical. 
      // User asked for "data updates". IDs are data.
      changes.push(`Équipe: "${oldProject.equipe || 'Aucune'}" -> "${updatedProject.equipe}"`);
    }

    const changesText = changes.length > 0 ? ` Modifications : ${changes.join(', ')}.` : ' Aucune modification détectée.';

    // Notify Admin
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet mis à jour',
      content: `Le projet "${oldProject.nom}" a été mis à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Error sending admin notification:', err));

    return updatedProject;
  }
};
