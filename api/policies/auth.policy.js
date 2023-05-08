const JWTService = require('../services/auth.service');
const Users = require('../models/User')

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;

  if (req.header('Authorization')) {
    const parts = req.header('Authorization').split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
      }
    } else {
      return res.status(401).json({ msg: 'Format for Authorization: Bearer [token]' });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  
  } else if (req.query.token) {
    tokenToVerify = req.query.token;
    //delete req.query.token;
  } 
  else {
    console.log("here")
    console.log('=== [auth.policy.js]:: req.query.token ===', req.query.token , typeof(req.query.token));
    return res.status(401).json({ msg: 'No Authorization was found' });
  }

  return JWTService().verify(tokenToVerify, async (err, thisToken) => {
    if (err) return res.status(401).json({ err });
    req.token = thisToken;
    console.log('=== [auth.policy.js]:: thisToken ===', thisToken , typeof(thisToken));
    try {
      const user = await Users
      .findOne({
        where: {
          id: thisToken.id
        },
      });
      req.userInfo = {}
      req.userInfo.id = user.id;
      req.userInfo.username = user.username;
      req.userInfo.type = user.type;
    return next();
    } catch (error) {
      console.log(error)
    }
  });
};
