module.exports = function serverError(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 500;

  if (data === undefined) {
    sails.log.error('Ran custom response: res.serverError()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.error('Custom response `res.serverError()` called with an Error:', data);
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
