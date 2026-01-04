module.exports = {
  friendlyName: 'Mettre à jour un projet',
  description: 'Mettre à jour un projet existant.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID du projet à mettre à jour.'
    },
    nom: {
      type: 'string',
      description: 'Le nouveau nom du projet.'
    },
    description: {
      type: 'string',
      description: 'La nouvelle description du projet.'
    },
    equipe: {
      type: 'string',
      description: 'L\'ID de la nouvelle équipe associée à ce projet.'
    }
  },

  exits: {
    success: {
      description: 'Projet mis à jour avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Projet non trouvé.'
    }
  },

  fn: async function ({ id, nom, description, equipe }) {
    const oldProject = await Projet.findOne({ id });
    if (!oldProject) {
      throw 'notFound';
    }

    const updatedProject = await Projet.updateOne({ id })
      .set({ nom, description, equipe });

    // Changements
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
      changes.push(`Équipe: "${oldProject.equipe || 'Aucune'}" -> "${updatedProject.equipe}"`);
    }

    const changesText = changes.length > 0 ? ` Modifications : ${changes.join(', ')}.` : ' Aucune modification détectée.';

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Projet mis à jour',
      content: `Le projet "${oldProject.nom}" a été mis à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return updatedProject;
  }
};
