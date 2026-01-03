module.exports = async function (req, res, next) {
  // If user is admin/formateur, they can access anything
  if (req.me.role === 'admin' || req.me.role === 'formateur') {
    return next();
  }

  // Incubés can only access their own presence data or history
  if (req.me.role === 'incube') {
    // If accessing a specific presence ID
    if (req.params.id) {
      const presence = await Presence.findOne({ id: req.params.id });
      if (!presence) return res.notFound();
      if (presence.incube !== req.me.id) return res.forbidden();
      return next();
    }
    // If listing, the controller should filter by incube.id
    return next();
  }

  return res.forbidden();
};
