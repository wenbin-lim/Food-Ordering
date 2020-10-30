// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /customisations              GET
// New      /customisations/new          GET
// Create   /customisations              POST
// Show     /customisations/:id          GET
// Edit     /customisations/:id/edit     GET
// Update   /customisations/:id          PUT
// Delete   /customisations/:id          DELETE
// ====================================================================================================

// ====================================================================================================
// Packages
// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, body, validationResult } = require('express-validator');

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();
const accessLevel = config.get('accessLevel');

// ====================================================================================================
// Models
// ====================================================================================================
const Customisation = require('../models/Customisation');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');
const { isValidObjectId } = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/customisations
// @desc     List all customisations
// @access   Private for customer and above
router.get('/', auth(false, accessLevel.customer), async (req, res) => {
  try {
    const { company } = req.query;

    let customisations = await Customisation.find({
      company,
    });

    res.json(customisations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/customisations
// @desc     Create new customisations
// @access   Private, admin and above only
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('title', 'Please enter a title').exists({ checkFalsy: true }),
    check(
      'selection',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    body('options').toArray(),
    check('min', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
    check('max', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    let {
      name,
      title,
      availability,
      selection,
      options,
      min,
      max,
      company,
    } = req.body;

    let errors = validationResult(req).array();

    if (selection === 'range' && parseInt(max) < parseInt(min)) {
      errors.push({
        location: 'body',
        msg: `Max value cannot be lesser than min value of ${min}`,
        param: 'max',
      });
    }

    if (parseInt(min) > options.length) {
      errors.push({
        location: 'body',
        msg: `Min value cannot be more than number of options of ${options.length}`,
        param: 'min',
      });
    }

    if (parseInt(max) > options.length) {
      errors.push({
        location: 'body',
        msg: `Max value cannot be more than number of options of ${options.length}`,
        param: 'max',
      });
    }

    if (options.length === 0) {
      errors.push({
        location: 'body',
        msg: 'Options cannot be empty',
        param: 'options',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      // sanitize min and max
      if (selection === 'nolimit') {
        min = 0;
        max = 0;
      } else if (selection === 'min') {
        max = 0;
      } else if (selection === 'max') {
        min = 0;
      }

      // sanitize options by replacing the given uuid into mongoid
      if (options) {
        options = options.map(option => {
          if (!isValidObjectId(option._id)) {
            option._id = new ObjectId();
          }
          return option;
        });
      }

      let customisation = new Customisation({
        name,
        title,
        selection,
        availability,
        min,
        max,
        options,
        company,
      });

      // save customisation to db
      await customisation.save();

      res.json(customisation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/customisations/:id
// @desc     Get single customisations
// @access   Private
router.get(
  '/:id',
  [
    auth(true, accessLevel.customer),
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
      // get a single customisation
      let customisation = await Customisation.findById(req.params.id).populate(
        'company',
        'displayedName'
      );

      if (!customisation) {
        return res.status(404).send('Customisation not found');
      }

      res.json(customisation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/customisations/:id
// @desc     Update single customisations
// @access   Public/Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('title', 'Please enter a title').exists({ checkFalsy: true }),
    check(
      'selection',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    body('options').toArray(),
    check('min', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
    check('max', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
  ],
  async (req, res) => {
    let { name, title, availability, selection, options, min, max } = req.body;

    let errors = validationResult(req).array();

    if (selection === 'range' && parseInt(max) < parseInt(min)) {
      errors.push({
        location: 'body',
        msg: `Max value cannot be lesser than min value of ${min}`,
        param: 'max',
      });
    }

    if (parseInt(min) > options.length) {
      errors.push({
        location: 'body',
        msg: `Min value cannot be more than number of options of ${options.length}`,
        param: 'min',
      });
    }

    if (parseInt(max) > options.length) {
      errors.push({
        location: 'body',
        msg: `Max value cannot be more than number of options of ${options.length}`,
        param: 'max',
      });
    }

    if (options.length === 0) {
      errors.push({
        location: 'body',
        msg: 'Options cannot be empty',
        param: 'options',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let customisation = await Customisation.findById(req.params.id);

      if (!customisation) {
        return res.status(404).send('Customisation not found');
      }

      // sanitize min and max
      if (selection === 'nolimit') {
        min = 0;
        max = 0;
      } else if (selection === 'min') {
        max = 0;
      } else if (selection === 'max') {
        min = 0;
      }

      // sanitize options
      if (options) {
        options = options.map(option => {
          if (!isValidObjectId(option._id)) {
            option._id = new ObjectId();
          }
          return option;
        });
      }

      customisation.name = name;
      customisation.title = title;
      customisation.selection = selection;
      customisation.availability = availability;
      customisation.min = min;
      customisation.max = max;
      customisation.options = options;

      // save customisation to db
      await customisation.save();

      res.json(customisation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/customisations/:id
// @desc     Delete single customisations
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
      let deleteCustomisation = await Customisation.findByIdAndRemove(
        req.params.id
      );

      if (!deleteCustomisation) {
        return res.status(404).send('Customisation not found');
      }

      res.json(deleteCustomisation);
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
