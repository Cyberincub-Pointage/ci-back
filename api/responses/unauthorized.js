module.exports = function unauthorized(data, options) {
  var req = this.req;
  var res = this.res;
  var statusCodeToSet = 401;

  if (data === undefined) {
    sails.log.info('Ran custom response: res.unauthorized()');
    return res.sendStatus(statusCodeToSet);
  } else if (_.isError(data)) {
    sails.log.info('Custom response `res.unauthorized()` called with an Error:', data);
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
  return res.redirect('/login');
};
