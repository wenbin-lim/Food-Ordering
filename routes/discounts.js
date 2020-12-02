// Packages
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Variables
const router = express.Router();
const accessLevel = config.get('accessLevel');
const discountTypes = config.get('discountTypes');

// Models
const Discount = require('../models/Discount');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');

// Routes

// @route    GET api/discounts
// @desc     List all discounts
// @access   Public/Private
router.get('/', auth(true, accessLevel.staff), async (req, res) => {
  try {
    const { access, company } = req;

    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
    };

    let discounts = await Discount.find(query);

    res.json(discounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/discounts
// @desc     Create new discounts
// @access   Public/Private
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check(
      'code',
      'Please enter a valid code of at least 4 characters'
    ).isLength({ min: 4 }),
    check('expiry')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage('An unexpected error occured, please try again later!'),
    check(
      'type',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    check('minSpending')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a value')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
    check('value')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a value')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
    check('cap')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    const { code, expiry, minSpending, type, value, cap, company } = req.body;

    let errors = validationResult(req).array();

    if (!discountTypes[type]) {
      errors.push({
        location: 'body',
        msg: 'An unexpected error occured, please try again later!',
        param: 'type',
      });
    }

    if (type === discountTypes.percentage) {
      if (value < 0 || value > 100) {
        errors.push({
          location: 'body',
          msg: 'Please enter a valid percentage value between 0 to 100',
          param: 'value',
        });
      }
    } else if (type === discountTypes.cash) {
      if (value < 0) {
        errors.push({
          location: 'body',
          msg: 'Please enter a positive value',
          param: 'value',
        });
      }
    }

    // check if unique code
    const discountAlreadyExists = await Discount.findOne({
      company: req.access < accessLevel.wawaya ? req.company : company,
      code: { $regex: new RegExp(`^${code}$`, 'i') },
    });

    if (discountAlreadyExists) {
      errors.push({
        location: 'body',
        msg: 'Code already exists',
        param: 'code',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let discount = new Discount({
        code,
        expiry,
        minSpending,
        type,
        value,
        cap: type === discountTypes.percentage ? cap : undefined,
        createdBy: req.access < accessLevel.wawaya ? req.user : undefined,
        company: req.access < accessLevel.wawaya ? req.company : company,
      });

      await discount.save();

      res.json(discount);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/discounts/:id
// @desc     Get single discounts
// @access   Public/Private
router.get(
  '/:id',
  [
    auth(true, accessLevel.staff),
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

      let discount = await Discount.findOne(query).populate(
        'createdBy',
        'name'
      );

      if (!discount) {
        return res.status(404).send('Discount not found');
      }

      res.json(discount);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/discounts/:id
// @desc     Update single discounts
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
      'code',
      'Please enter a valid code of at least 4 characters'
    ).isLength({ min: 4 }),
    check('expiry')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate()
      .withMessage('An unexpected error occured, please try again later!'),
    check(
      'type',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    check('minSpending')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a value')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
    check('value')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a value')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
    check('cap')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Value can only accept up to 2 decimal places'),
  ],
  async (req, res) => {
    const { code, expiry, minSpending, type, value, cap } = req.body;

    let errors = validationResult(req).array();

    if (!discountTypes[type]) {
      errors.push({
        location: 'body',
        msg: 'An unexpected error occured, please try again later!',
        param: 'type',
      });
    }

    if (type === discountTypes.percentage) {
      if (value < 0 || value > 100) {
        errors.push({
          location: 'body',
          msg: 'Please enter a valid percentage value between 0 to 100',
          param: 'value',
        });
      }
    } else if (type === discountTypes.cash) {
      if (value < 0) {
        errors.push({
          location: 'body',
          msg: 'Please enter a positive value',
          param: 'value',
        });
      }
    }

    try {
      const { access: userAccess, company } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let discount = await Discount.findOne(query);

      if (!discount) {
        return res.status(404).send('Discount not found');
      }

      // check if discount code is unique
      if (code !== discount.code) {
        const discountAlreadyExists = await Discount.findOne({
          company: userAccess < accessLevel.wawaya ? company : discount.company,
          code: { $regex: new RegExp(`^${code}$`, 'i') },
        });

        if (discountAlreadyExists) {
          errors.push({
            location: 'body',
            msg: 'Code already exists',
            param: 'code',
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      discount.code = code;
      discount.expiry = expiry;
      discount.minSpending = minSpending;
      discount.type = type;
      discount.value = value;
      discount.cap = type === discountTypes.percentage ? cap : undefined;

      await discount.save();

      res.json(discount);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/discounts/:id
// @desc     Delete single discounts
// @access   Public/Private
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

      let deletedDiscount = await Discount.findOneAndRemove(query);

      if (!deletedDiscount) {
        return res.status(404).send('Discount not found');
      }

      res.json(deletedDiscount);
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
