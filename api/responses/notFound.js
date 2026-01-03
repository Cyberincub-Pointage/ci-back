module.exports = function notFound(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 404;

  if (data === undefined) {
    sails.log.info('Ran custom response: res.notFound()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.info('Custom response `res.notFound()` called with an Error:', data);
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
