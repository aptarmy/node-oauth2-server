const access_tokens = [];
const refresh_tokens = [];
const users = [
    {
        _id: 'u0001',
        username: 'user001',
        password: 'password001',
        email: 'user001@gmail.com',
        name: 'Mr. Bean'
    }
];
const clients = [
    {
        _id: 'c0001',
        clientId: '001',
        clientSecret: 'secret',
        grants: ['password'],
    }
];

module.exports = {
    getClient(clientId, clientSecret, cb) {
        console.log('receive client ID & secret : ', clientId, clientSecret);
        // imaginary DB query
        const params = { clientId, clientSecret};
        client = clients.find(client => (client.clientId == params.clientId && client.clientSecret == params.clientSecret));
        // return error if client not found
        if (!client) { return cb({ status: 'error', message: 'client_id or client_secret was wrong.' }) }
        // oauth2-server library expects `id` property
        client.id = client._id
        cb(null, client);
    },
    
    getUser(username, password, cb) {
        const user = users.find(user => (user.username == username && user.password == password));
        // if user not found, return error
        if (!user) { return cb({ status: 'error', message: 'username or password was wrong' }) }
        // oauth2-server library expects `id` property
        user.id = user._id;
        cb(null, user)        
    },
    
    saveToken(token, client, user, cb) {
      // Access Token
      access_tokens.push({
        access_token: token.accessToken,
        expires_at: token.accessTokenExpiresAt,
        client_id: client.id,
        user_id: user.id
      });
      
      // Refresh Token
      refresh_tokens.push({
        refresh_token: token.refreshToken,
        expires_at: token.refreshTokenExpiresAt,
        client_id: client.id,
        user_id: user.id
      });
      
      const responseToken = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        client: { id: client.id},
        user: { id: user.id }
      };
      cb(null, responseToken);
    },

    getAccessToken(accessToken, cb) {
      // debug token saved in memory
      foundToken = access_tokens.find(token => token.access_token == accessToken);
      if(!foundToken) { return cb({ status: 'error', 'message': 'token not found' }); }
      
      foundClient = clients.find(client => client._id == foundToken.client_id);
      if(!foundClient) { return cb({ status: 'error', 'message': 'client not found' }) }
      
      console.log('\nusers: ', users[0], '\n');
      console.log('\nfoundToken.user_id: ', foundToken.user_id, '\n')
      foundUser = users.find(user => user._id == foundToken.user_id);
      console.log('\nfoundUser', foundUser, '\n')
      if(!foundUser) { return cb({ status: 'error', 'message': 'user not found' }); }

      const responseToken = {
        accessToken: foundToken.access_token,
        accessTokenExpiresAt: foundToken.expires_at,
        client: { id: foundClient._id},
        user: { id: foundUser._id}
      };
      cb(null, responseToken)
  }
};