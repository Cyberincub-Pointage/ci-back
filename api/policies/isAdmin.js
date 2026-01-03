module.exports = async function (req, res, next) {
  if (req.me && (req.me.role === 'admin' || req.me.role === 'super_admin')) {
    return next();
  }
  return res.forbidden();
};
