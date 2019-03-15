module.exports.postOauth2Login = function(oauth, Request, Response){
  return function(req, res) {
    let request = new Request(req);
    let response = new Response(res);
    return oauth.token(request, response)
      .then(function(token) {
        res.json(token);
      })
      .catch(function(err) {
        res.json(err);
      });
  }
};

module.exports.getProtectedResources = function(req, res) {
  res.json({ message: 'This is a secret message' });
}