module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      description: 'L\'adresse email unique de l\'incubé.'
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
      description: 'Le mot de passe hashé de l\'incubé.'
    },
    nom: {
      type: 'string',
      required: true,
      description: 'Le nom de famille de l\'incubé.'
    },
    prenom: {
      type: 'string',
      required: true,
      description: 'Le prénom de l\'incubé.'
    },
    telephone: {
      type: 'string',
      description: 'Le numéro de téléphone de l\'incubé.'
    },
    role: {
      type: 'string',
      isIn: ['incube'],
      defaultsTo: 'incube',
      description: 'Le rôle de l\'utilisateur (toujours "incube").'
    },
    photoUrl: {
      type: 'string',
      description: 'L\'URL de la photo de profil de l\'incubé.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'active', 'suspended'],
      defaultsTo: 'pending',
      description: 'Le statut actuel du compte incubé (en attente, actif, suspendu).'
    },
    rib: {
      type: 'string',
      description: 'Le RIB de l\'incubé pour les virements.'
    },
    equipe: {
      model: 'equipe',
      description: 'L\'équipe à laquelle l\'incubé appartient.'
    },
    projet: {
      model: 'projet',
      description: 'Le projet principal de l\'incubé.'
    },
    banque: {
      model: 'banque',
      description: 'La banque de l\'incubé.'
    },
    presences: {
      collection: 'presence',
      via: 'incube',
      description: 'L\'historique des présences de l\'incubé.'
    },
    retroRequests: {
      collection: 'retroPresenceRequest',
      via: 'incube',
      description: 'Les demandes de régularisation de présence.'
    },
    permissionRequests: {
      collection: 'permissionrequest',
      via: 'incube',
      description: 'Les demandes de permission de l\'incubé.'
    },
    warnings: {
      collection: 'warning',
      via: 'incube',
      description: 'Les avertissements reçus par l\'incubé.'
    },
    emailProofToken: {
      type: 'string',
      description: 'Token pour la vérification de l\'email.'
    },
    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de vérification (timestamp).'
    },
    passwordResetToken: {
      type: 'string',
      description: 'Token pour la réinitialisation du mot de passe.'
    },
    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'Date d\'expiration du token de réinitialisation.'
    },
    pendingRib: {
      type: 'string',
      description: 'RIB en attente de validation.'
    },
    pendingBanque: {
      model: 'banque',
      description: 'Banque en attente de validation.'
    },
    pendingEquipe: {
      model: 'equipe',
      description: 'Equipe en attente de validation.'
    }
  },
  customToJSON: function () {
    return _.omit(this, ['password']);
  }
};
