// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /route              GET
// New      /route/new          GET
// Create   /route              POST
// Show     /route/:id          GET
// Edit     /route/:id/edit     GET
// Update   /route/:id          PUT
// Delete   /route/:id          DELETE
// ====================================================================================================

// ====================================================================================================
// Packages
// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();
const customerAccessLevel = config.get('accessLevel.customer');

// ====================================================================================================
// Models
// ====================================================================================================
const User = require('../models/User');
const Table = require('../models/Table');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/auth
// @desc     decode jwt token and return
// @access   Private
router.get('/', auth(true), async (req, res) => {
  try {
    // look at auth middleware to see what is sent
    res.json({
      token: req.token,
      ...req.decodedToken,
    });
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
      let user = await User.findOne({ username }).populate(
        'company',
        'name logo socialMediaLinks'
      );

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
      const payload = {
        auth: {
          id: user.id,
          role: user.role,
        },
        access: user.access,
        company: user.company,
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          // expiresIn: 10,
        },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            ...payload,
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/auth/table
// @desc     Authenticate table & get token
// @access   Public
router.post(
  '/table',
  [
    check('tableId', 'Invalid Credentials').not().isEmpty().isMongoId(),
    check('companyId', 'Invalid Credentials').not().isEmpty().isMongoId(),
  ],
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const { tableId, companyId } = req.body;

    try {
      let table = await Table.findOne({
        _id: tableId,
        company: companyId,
      }).populate('company', 'name logo socialMediaLinks');

      // check if table exists
      if (!table) {
        return res.status(403).json('No table exists');
      }

      // return jwt back to user
      const payload = {
        auth: {
          id: tableId,
          name: table.name,
        },
        access: customerAccessLevel,
        company: table.company,
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 10,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token, ...payload });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
