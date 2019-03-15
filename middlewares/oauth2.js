module.exports.isAuthenticated = function(oauth, Request, Response) {
  return function(req, res, next) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth.authenticate(request, response)
      .then(function(token) {
        res.locals.access_token = token;
        next();
      })
      .catch(function(err) {
        res.json(err)
      });
  }
}