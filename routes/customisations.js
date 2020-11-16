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
const Option = require('../models/Option');
const Food = require('../models/Food');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/customisations
// @desc     List all customisations
// @access   Private for staff and above
router.get('/', auth(false, accessLevel.staff), async (req, res) => {
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
      'optional',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    body('options').toArray(),
    check('min', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
    check('max', 'Value must be a whole number that is more than 1').isInt({
      min: 1,
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
      optional,
      options,
      min,
      max,
      company,
    } = req.body;

    let errors = validationResult(req).array();

    if (!optional && parseInt(max) < parseInt(min)) {
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
      if (options) {
        options = options.map(
          ({ name, price, availability }) =>
            new Option({
              name,
              price,
              availability,
            })
        );
      }

      let customisation = new Customisation({
        name,
        title,
        optional,
        availability,
        min: optional ? 0 : min,
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
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let customisation = await Customisation.findOne(query);

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
      'optional',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    body('options').toArray(),
    check('min', 'Value must be a whole number').isInt({
      min: 0,
      allow_leading_zeroes: false,
    }),
    check('max', 'Value must be a whole number that is more than 1').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
  ],
  async (req, res) => {
    let { name, title, availability, optional, options, min, max } = req.body;

    let errors = validationResult(req).array();

    if (!optional && parseInt(max) < parseInt(min)) {
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
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let customisation = await Customisation.findOne(query);

      if (!customisation) {
        return res.status(404).send('Customisation not found');
      }

      // sanitize options
      if (options) {
        options = options.map(
          ({ name, price, availability }) =>
            new Option({
              name,
              price,
              availability,
            })
        );
      }

      customisation.name = name;
      customisation.title = title;
      customisation.optional = optional;
      customisation.availability = availability;
      customisation.min = optional ? 0 : min;
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
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let deleteCustomisation = await Customisation.findOneAndRemove(query);

      if (!deleteCustomisation) {
        return res.status(404).send('Customisation not found');
      }

      res.json(deleteCustomisation);

      await Food.updateMany(
        { customisations: req.params.id },
        { $pull: { customisations: req.params.id } }
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
