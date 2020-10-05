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

// ====================================================================================================
// Models
// ====================================================================================================
const User = require('../models/User');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/auth
// @desc     Get logged in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);
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
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    const { username, password, date } = req.body;

    console.log(typeof new Date(date));

    try {
      let user = await User.findOne({ username });

      // check if user exists with input username
      if (!user) {
        return res.status(403).json('Invalid Credentials');
      }

      // check if input password matches db password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json('Invalid Credentials');
      }

      // return jwt back to user
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          // expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;

          res.json({ token });
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
