module.exports = function serverError(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 500;

  if (data === undefined) {
    sails.log.error('Exécution de la réponse personnalisée : res.serverError()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.error('Réponse personnalisée `res.serverError()` appelée avec une erreur :', data);
    if (!_.isFunction(data.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(statusCodeToSet);
      } else {
        return res.status(statusCodeToSet).send(data.stack);
      }
    }
  }
  res.status(statusCodeToSet);
  if (req.wantsJSON) {
    return res.json(data);
  }
  return res.sendStatus(statusCodeToSet);
};
