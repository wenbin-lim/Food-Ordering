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
const { check, body, validationResult } = require('express-validator');
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
    const { company } = req.query;

    let users = await User.find({ company }).select('-password');

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
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a username')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a password')
      .bail()
      .isLength({ min: 5 })
      .withMessage('Password should be at least 5 characters')
      .bail()
      .custom(value =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{5,}$/g.test(
          value
        )
      )
      .withMessage(
        'Password should have at least one letter, one number and one special character'
      ),
    check('access', `Please enter a valid access`).isInt({
      min: accessLevel.staff,
      max: accessLevel.wawaya,
    }),
    body('role').toArray(),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    const { name, username, password, access, role, company } = req.body;

    let errors = validationResult(req).array();

    try {
      // check if username already exist
      let user = await User.findOne({ username });

      user &&
        errors.push({
          location: 'body',
          msg: 'Email has been taken',
          param: 'username',
        });

      role.length === 0 &&
        errors.push({
          location: 'body',
          msg: 'Please select at least one role',
          param: 'role',
        });

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
router.get(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let user = await User.findOne(query).select('-password');

      if (!user) {
        return res.status(404).send('User not found');
      }

      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/users/:id
// @desc     Update single user
// @access   Public/Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a username')
      .bail()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('password')
      .optional({ checkFalsy: true })
      .isLength({ min: 5 })
      .withMessage('Password should be at least 5 characters')
      .bail()
      .optional({ checkFalsy: true })
      .custom(value =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{5,}$/g.test(
          value
        )
      )
      .withMessage(
        'Password should have at least one letter, one number and one special character'
      ),
    check('access', `Please enter a valid access`).isInt({
      min: accessLevel.staff,
      max: accessLevel.wawaya,
    }),
    body('role').toArray(),
  ],
  async (req, res) => {
    const { name, username, password, access, role } = req.body;

    let errors = validationResult(req).array();

    try {
      const { access: userAccess, company } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let user = await User.findOne(query);

      if (!user) {
        return res.status(404).send('User not found');
      }

      // check if username already exist elsewhere
      // can be the previous username
      if (user.username !== username) {
        let userWithNewUsername = await User.findOne({ username });

        if (userWithNewUsername)
          errors.push({
            location: 'body',
            msg: 'Email has been taken',
            param: 'username',
          });
      }

      if (role.length === 0)
        errors.push({
          location: 'body',
          msg: 'Please select at least one role',
          param: 'role',
        });

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
// @access   Private
router.delete(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let deletedUser = await User.findOneAndRemove(query);

      if (!deletedUser) {
        return res.status(404).send('User not found');
      }

      res.json(deletedUser);
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
