// ====================================================================================================
// Packages
// ====================================================================================================
const config = require('config');
const jwt = require('jsonwebtoken');

const { public: publicAccess } = config.get('accessLevel');

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = (privateOnly, minAccessLevel = publicAccess) => {
  return (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
      if (privateOnly) {
        // user is public trying to access private route
        return res.status(401).json({ msg: 'Authorisation Denied' });
      } else {
        // user is public trying to access public and private route
        req.access = publicAccess;
        return next();
      }
    }

    // token exists, user has private access
    try {
      const decoded = jwt.verify(token, config.get('jwtSecret'));

      if (decoded.access <= minAccessLevel - 1) {
        // user has access level lower than required
        return res.status(401).json({ msg: 'Authorisation Denied' });
      }

      req.company = decoded.company._id;
      req.access = decoded.access;
      req.auth = decoded;

      next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ msg: 'Invalid token' });
    }
  };
};
