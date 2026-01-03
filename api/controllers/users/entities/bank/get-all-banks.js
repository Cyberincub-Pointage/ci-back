module.exports = {
  friendlyName: 'Get All Banks',
  description: 'Retrieve a list of all banks.',
  inputs: {},
  exits: {
    success: {
      description: 'List of banks retrieved successfully.'
    }
  },
  fn: async function () {
    const banks = await Banque.find();
    return banks;
  }
};
