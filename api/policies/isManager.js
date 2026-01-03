module.exports = async function (req, res, next) {
  if (req.me && (
    req.me.role === 'admin' ||
    req.me.role === 'super_admin' ||
    req.me.role === 'formateur' ||
    req.me.role === 'formateur_principal'
  )) {
    return next();
  }
  return res.forbidden();
};
