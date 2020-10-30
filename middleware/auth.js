// ====================================================================================================
// Packages
// ====================================================================================================
const config = require('config');
const jwt = require('jsonwebtoken');

const { public: publicAccess, customer: customerAccess } = config.get(
  'accessLevel'
);

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = (privateOnly, minAccessLevel = customerAccess) => {
  return (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
      if (privateOnly) {
        // user is public trying to access private route
        return res.status(401).send('Unauthorized');
      } else {
        // user is public trying to access public and private route
        req.access = publicAccess;
        return next();
      }
    }

    // token exists, user has private access
    try {
      const decodedToken = jwt.verify(token, config.get('jwtSecret'));
      const { auth, access, company } = decodedToken;

      if (access < minAccessLevel) {
        return res.status(401).send('Unauthorized');
      }

      if (company) {
        const { _id: companyId, name: companyName } = company;

        req.companyName = companyName;
        req.company = companyId;
      }

      req.access = access ? access : publicAccess;

      req.auth = auth;

      delete decodedToken.iat;
      req.decodedToken = decodedToken;
      req.token = token;

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('Invalid Token');
    }
  };
};
