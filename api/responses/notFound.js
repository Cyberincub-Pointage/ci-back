module.exports = function notFound(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 404;

  if (data === undefined) {
    sails.log.info('Exécution de la réponse personnalisée : res.notFound()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.info('Réponse personnalisée `res.notFound()` appelée avec une erreur :', data);
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
