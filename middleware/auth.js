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
      const { user, table } = decodedToken;

      if (user) {
        const {
          _id: userId,
          access,
          company: { _id: companyId },
        } = user;

        if (access < minAccessLevel) {
          return res.status(401).send('Unauthorized');
        }

        req.company = companyId;
        req.access = access;
        req.user = userId;
      } else if (table) {
        if (customerAccess < minAccessLevel) {
          return res.status(401).send('Unauthorized');
        }

        const {
          _id: tableId,
          company: { _id: companyId },
        } = table;

        req.company = companyId;
        req.access = customerAccess;
        req.table = tableId;
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('Invalid Token');
    }
  };
};
