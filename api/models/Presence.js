module.exports = {
  attributes: {
    date: {
      type: 'string',
      required: true,
      description: 'La date de la présence.'
    },
    heureArrivee: {
      type: 'string',
      description: 'L\'heure d\'arrivée de l\'incubé.'
    },
    heureDepart: {
      type: 'string',
      description: 'L\'heure de départ de l\'incubé.'
    },
    status: {
      type: 'string',
      isIn: ['pending', 'validated', 'rejected'],
      defaultsTo: 'pending',
      description: 'Le statut de la présence (en attente, validée, rejetée).'
    },
    isGeolocValid: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Indique si la géolocalisation était valide lors du pointage.'
    },
    isRetro: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Indique si la présence a été créée via une demande rétroactive.'
    },
    latitude: {
      type: 'number',
      columnType: 'float',
      description: 'La latitude de la géolocalisation.'
    },
    longitude: {
      type: 'number',
      columnType: 'float',
      description: 'La longitude de la géolocalisation.'
    },
    paymentStatus: {
      type: 'string',
      isIn: ['unpaid', 'paid'],
      defaultsTo: 'unpaid',
      description: 'Le statut de paiement associé à cette présence.'
    },
    amount: {
      type: 'number',
      description: 'Le montant à payer pour cette présence.'
    },
    rejectionReason: {
      type: 'string',
      description: 'La raison du rejet de la présence.'
    },
    validatedAt: {
      type: 'ref',
      columnType: 'timestamp',
      description: 'La date et l\'heure de la validation.'
    },
    incube: {
      model: 'incube',
      required: true,
      description: 'L\'incubé concerné par cette présence.'
    },
    validatedBy: {
      model: 'formateur',
      description: 'Le formateur ayant validé la présence.'
    }
  }
};
