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
        console.error('Public trying to access private route');
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
      const { user, bill } = decodedToken;

      if (user) {
        const {
          _id: userId,
          access,
          company: { _id: companyId },
        } = user;

        if (access < minAccessLevel) {
          console.error(
            'Authorised user trying to access a higher access level route'
          );
          return res.status(401).send('Unauthorized');
        }

        req.company = companyId;
        req.access = access;
        req.user = userId;
      } else if (bill) {
        if (customerAccess < minAccessLevel) {
          console.error(
            'Authorised customer trying to access a higher access level route'
          );
          return res.status(401).send('Unauthorized');
        }

        const {
          _id: billId,
          company: { _id: companyId },
        } = bill;

        req.company = companyId;
        req.access = customerAccess;
        req.bill = billId;
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).send('Invalid Token');
    }
  };
};
