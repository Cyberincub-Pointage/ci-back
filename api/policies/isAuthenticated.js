const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  let token;

  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Aucun jeton d\'autorisation n\'a été trouvé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.me = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Jeton invalide' });
  }
};
