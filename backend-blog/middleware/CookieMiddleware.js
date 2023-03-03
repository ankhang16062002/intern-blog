const resetCookieExprise = function (req, res, next) {
  if (req.session.passport) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
};

module.exports = resetCookieExprise;
