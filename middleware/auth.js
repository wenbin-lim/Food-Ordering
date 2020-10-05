// ====================================================================================================
// Packages
// ====================================================================================================
const config = require('config');
const jwt = require('jsonwebtoken');

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'Authorisation Denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // assign user from payload to req.user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};
