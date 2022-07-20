'use strict';

const jwt = require('jsonwebtoken');

//endpoint is received
exports.verifyToken = (req, authOrSecDef, token, callback) => {
  const sharedSecret = process.env.SHARED_SECRET;
  const issuer = process.env.ISSUER;

  function sendError() {
    return req.res.status(401).json({ message: 'Error: UnAuthorized' });
  }

  if (token) {
    jwt.verify(token, sharedSecret, (verificationError, decodedToken) => {
      if (verificationError === null && decodedToken) {
        const issuerMatch = decodedToken.iss === issuer;

        if (issuerMatch) {
          req.auth = decodedToken;
          return callback(null);
        } else {
          return callback(sendError());
        }
      } else {
        return callback(sendError());
      }
    });
  } else {
    return callback(sendError());
  }
};

exports.issueToken = email => {
  const sharedSecret = process.env.SHARED_SECRET;
  const issuer = process.env.ISSUER;
  const token = jwt.sign(
    {
      email: email,
      iss: issuer
    },
    sharedSecret
  );
  return token;
};
