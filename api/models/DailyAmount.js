module.exports = {
  attributes: {
    amount: {
      type: 'number',
      defaultsTo: 4500,
      description: 'The daily amount value.',
    },
    effectiveDate: {
      type: 'ref',
      required: true,
      description: 'The date from which this amount is effective (YYYY-MM-DD).',
      columnType: 'date'
    },
    createdBy: {
      model: 'Admin',
      description: 'The admin who set this amount.'
    },
  },
};
