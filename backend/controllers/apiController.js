const { getBearerToken } = require('../services/keyVaultService');

exports.getToken = async (req, res) => {
  try {
    const token = await getBearerToken('BearerToken');
    res.json({ bearerToken: token });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get token' });
  }
};
