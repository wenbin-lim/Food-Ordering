// Packages
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Variables
const router = express.Router();

// Models
const User = require('../models/User');
const Table = require('../models/Table');
const Bill = require('../models/Bill');
const Order = require('../models/Order');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');
const { isValidObjectId } = require('mongoose');

// ====================================================================================================
// Routes
// ====================================================================================================
// @route    GET api/auth
// @desc     decode jwt token and return
// @access   Private
router.get('/', auth(true), async (req, res) => {
  try {
    const { user, table } = req;

    if (user) {
      // need to authenticate to db in case user is already deleted and token is still there
      const user = await User.findById(req.user)
        .select('-password')
        .populate('company', 'name');

      if (!user) {
        return res.status(404).send('User not found');
      }

      return res.json(user);
    } else if (table) {
      const table = await Table.findById(req.table).populate('company', 'name');

      if (!table) {
        return res.status(404).send('Table not found');
      }
      return res.json(table);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('username', 'Username is required').exists({ checkFalsy: true }),
    check('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username }).populate('company', 'name');

      // check if user exists with input username
      if (!user) {
        return res.status(403).send('Invalid Credentials');
      }

      // check if input password matches db password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).send('Invalid Credentials');
      }

      // return jwt back to user
      delete user.password;

      const payload = { user };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          // expiresIn: 10,
        },
        (err, token) => {
          if (err) throw err;

          res.json({ user, token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/auth/customer
// @desc     Authenticate customer & get token
// @access   Public
router.post('/customer', async (req, res) => {
  const { tableId, companyId } = req.body;

  if (!isValidObjectId(tableId) || !isValidObjectId(companyId)) {
    return res.status(400).send('Bad Request');
  }

  try {
    let table = await Table.findOne({
      _id: tableId,
      company: companyId,
    }).populate('company', 'name');

    // check if table exists
    if (!table) {
      return res.status(404).json('Not Found');
    }

    let { bill } = table;

    if (!bill) {
      bill = new Bill({ company: companyId });
      await bill.save();

      table.bill = bill;
      await table.save();
    }

    // return jwt back to customer
    const payload = { table };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {
        // expiresIn: 10,
      },
      (err, token) => {
        if (err) throw err;

        res.json({ user: table, token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Exporting module
module.exports = router;
