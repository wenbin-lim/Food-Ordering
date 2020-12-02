// Packages
const config = require('config');
const jwt = require('jsonwebtoken');

// Models
const Bill = require('../models/Bill');

const { public: publicAccess, customer: customerAccess } = config.get(
  'accessLevel'
);
const billStatus = config.get('billStatus');

module.exports = (privateOnly, minAccessLevel = customerAccess) => {
  return async (req, res, next) => {
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
      const { user, bill } = decodedToken;

      if (user) {
        const {
          _id: userId,
          access,
          role,
          company: { _id: companyId },
        } = user;

        if (access < minAccessLevel) {
          return res.status(401).send('Unauthorized');
        }

        req.company = companyId;
        req.access = access;
        req.user = userId;
        req.userRole = role;
      } else if (bill) {
        if (customerAccess < minAccessLevel) {
          return res.status(401).send('Unauthorized');
        }

        const {
          _id: billId,
          company: { _id: companyId },
        } = bill;

        const foundBill = await Bill.findById(billId);

        if (!foundBill) {
          return res.status(401).send('Unauthorized');
        }

        if (foundBill?.status === billStatus.settled) {
          return res.status(401).send('Unauthorized');
        }

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
