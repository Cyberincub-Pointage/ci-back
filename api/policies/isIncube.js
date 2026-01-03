module.exports = async function (req, res, next) {
  if (req.me && req.me.role === 'incube') {
    return next();
  }
  return res.forbidden();
};
