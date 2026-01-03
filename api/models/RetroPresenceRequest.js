module.exports = {
  attributes: {
    date: {
      type: 'string',
      required: true,
      description: 'La date concernée par la demande de régularisation.'
    },
    motif: {
      type: 'string',
      required: true,
      description: 'Le motif de la demande de régularisation.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'validated', 'rejected'],
      defaultsTo: 'pending',
      description: 'Le statut de la demande (en attente, validée, rejetée).'
    },
    rejectionReason: {
      type: 'string',
      description: 'La raison du rejet de la demande.'
    },
    validatedAt: {
      type: 'ref',
      columnType: 'timestamp',
      description: 'La date et l\'heure de la validation de la demande.'
    },
    incube: {
      model: 'incube',
      required: true,
      description: 'L\'incubé ayant fait la demande.'
    },
    validatedBy: {
      model: 'formateur',
      description: 'Le formateur ayant traité la demande.'
    }
  }
};
