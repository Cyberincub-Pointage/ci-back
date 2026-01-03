module.exports = {
  attributes: {
    type: {
      type: 'string',
      required: true,
      isIn: ['absence', 'retard', 'sortie_anticipee', 'autre'],
      description: 'Le type de permission demandée.'
    },
    motif: {
      type: 'string',
      required: true,
      description: 'Le motif de la demande de permission.'
    },
    dateDebut: {
      type: 'string',
      required: true,
      description: 'La date de début de la permission.'
    },
    dateFin: {
      type: 'string',
      description: 'La date de fin de la permission (pour les permissions de plusieurs jours).'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'viewed', 'approved', 'rejected'],
      defaultsTo: 'pending',
      description: 'Le statut de la demande (en attente, vue, accordée, refusée).'
    },
    viewedAt: {
      type: 'ref',
      columnType: 'timestamp',
      description: 'La date et l\'heure à laquelle le formateur a vu la demande.'
    },
    processedAt: {
      type: 'ref',
      columnType: 'timestamp',
      description: 'La date et l\'heure du traitement de la demande.'
    },
    rejectionReason: {
      type: 'string',
      description: 'La raison du rejet de la demande.'
    },
    incube: {
      model: 'incube',
      required: true,
      description: 'L\'incubé ayant fait la demande.'
    },
    processedBy: {
      model: 'formateur',
      description: 'Le formateur ayant traité la demande.'
    }
  },

  // Lifecycle callback pour générer un ULID avant la création
  beforeCreate: function (values, proceed) {
    const { ulid } = require('ulid');
    if (!values.id) {
      values.id = ulid();
    }
    return proceed();
  }
};
