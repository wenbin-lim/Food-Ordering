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
const accessLevel = config.get('accessLevel');

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

// @route    GET api/users
// @desc     List all users
// @access   Private
router.get('/', auth(true, accessLevel.admin), async (req, res) => {
  try {
    // get all users in company
    let users = await User.find({ company: req.query.companyId }).select(
      '-password'
    );

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/users
// @desc     Register a user
// @access   Private
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check('name', 'Please enter a name').not().isEmpty(),
    check('username')
      // check if username is empty
      .not()
      .isEmpty()
      .withMessage('Please enter a username')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .exists()
      .withMessage('Please enter a password')
      .isLength({ min: 5 })
      .withMessage('Password should be at least 5 characters')
      .custom(value =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{5,}$/g.test(
          value
        )
      )
      .withMessage(
        'Password should have at least one letter, one number and one special valid character'
      ),
    check('access', `Please enter a valid access`).isInt({
      min: accessLevel.staff,
      max: accessLevel.wawaya,
    }),
    check('role', 'Invalid role type').isArray(),
    check('company', 'Invalid Company').isMongoId(),
  ],
  async (req, res) => {
    const { name, username, password, access, role, company } = req.body;

    try {
      let errors = validationResult(req).array();

      // check if username already exist
      let user = await User.findOne({ username });

      if (user) {
        errors.push({
          location: 'body',
          msg: 'Email has been taken',
          param: 'username',
        });
      }

      if (role.length === 0) {
        errors.push({
          location: 'body',
          msg: 'Role is required',
          param: 'role',
        });
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      user = new User({
        name,
        username,
        password,
        access,
        role,
        company,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save user to db
      await user.save();

      user = user.toObject();
      delete user.password;

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/users/:id
// @desc     Get single user
// @access   Private
router.get('/:id', auth(true, accessLevel.admin), async (req, res) => {
  try {
    // get a single user
    let user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User not found',
          },
        ],
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/users/:id
// @desc     Update single user
// @access   Public/Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check('name', 'Name is required').not().isEmpty(),
    check('username')
      // check if username is empty
      .not()
      .isEmpty()
      .withMessage('Please enter a username')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .optional({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage('Password should be at least 5 characters')
      .custom(value =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{5,}$/g.test(
          value
        )
      )
      .withMessage(
        'Password should have at least one letter, one number and one special valid character'
      ),
    check('access', `Please enter a valid access`).isInt({
      min: accessLevel.staff,
      max: accessLevel.wawaya,
    }),
    check('role', 'Invalid role type').isArray(),
  ],
  async (req, res) => {
    const { name, username, password, access, role } = req.body;

    let errors = validationResult(req);
    errors = errors.array();

    try {
      // get the user
      let user = await User.findById(req.params.id);

      if (!user) {
        // User not found
        return res.status(406).send('An unexpected error occured');
      }

      // check if username already exist elsewhere
      // can be the previous username
      if (user.username !== username) {
        let userWithNewUsername = await User.findOne({ username });

        if (userWithNewUsername) {
          errors.push({
            location: 'body',
            msg: 'Email has been taken',
            param: 'username',
          });
        }
      }

      if (role.length === 0) {
        errors.push({
          location: 'body',
          msg: 'Role is required',
          param: 'role',
        });
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      user.username = username;
      user.name = name;
      user.role = role;
      user.access = access;

      if (password) {
        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      // save user to db
      await user.save();

      user = user.toObject();
      delete user.password;

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/users/:id
// @desc     Delete single user
// @access   Public/Private
router.delete('/:id', async (req, res) => {
  try {
    // get the user
    let user = await User.findById(req.params.id);

    if (!user) {
      // User not found
      return res.status(406).send('An unexpected error occured');
    }

    // delete user
    await User.findByIdAndRemove(req.params.id);

    res.json({ userId: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
