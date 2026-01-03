module.exports = function forbidden(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 403;

  if (data === undefined) {
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.info('Custom response `res.forbidden()` called with an Error:', data);
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
