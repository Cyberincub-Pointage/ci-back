module.exports = {
  friendlyName: 'Mettre à jour une équipe',
  description: 'Mettre à jour une équipe existante.',

  inputs: {
    id: {
      type: 'string',
      required: true,
      description: 'L\'ID de l\'équipe à mettre à jour.'
    },
    nom: {
      type: 'string',
      description: 'Le nouveau nom de l\'équipe.'
    },
    description: {
      type: 'string',
      description: 'La nouvelle description de l\'équipe.'
    },
    formateur: {
      type: 'string',
      description: 'L\'ID du nouveau formateur responsable.'
    }
  },

  exits: {
    success: {
      description: 'Équipe mise à jour avec succès.'
    },
    notFound: {
      statusCode: 404,
      description: 'Équipe non trouvée.'
    }
  },

  fn: async function ({ id, nom, description, formateur }) {
    const oldTeam = await Equipe.findOne({ id });
    if (!oldTeam) {
      throw 'notFound';
    }

    const updatedTeam = await Equipe.updateOne({ id })
      .set({ nom, description, formateur });

    // Changements
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

    // Notifier l'Administrateur
    await sails.helpers.sender.notification.with({
      recipientId: this.req.me.id,
      model: 'admin',
      app: 'ci',
      title: 'Équipe mise à jour',
      content: `L'équipe "${oldTeam.nom}" a été mise à jour.${changesText}`,
      priority: 'normal',
      isForAdmin: true
    }).catch(err => sails.log.error('Erreur lors de l\'envoi de la notification administrateur :', err));

    return updatedTeam;
  }
};
