// Packages
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');

// ====================================================================================================
const router = express.Router();
const accessLevel = config.get('accessLevel');

// Models
const Table = require('../models/Table');
const Bill = require('../models/Bill');
const Order = require('../models/Order');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');

// Routes

// @route    GET api/tables
// @desc     List all tables
// @access   Private, admin and above only
router.get('/', auth(true, accessLevel.staff), async (req, res) => {
  try {
    const { access, company } = req;

    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
    };

    let tables = await Table.find(query).populate('bill');

    res.json(tables);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/tables
// @desc     Create new tables
// @access   Private, admin and above only
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    const { name, company } = req.body;

    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let table = new Table({
        name,
        company: req.access < accessLevel.wawaya ? req.company : company,
      });

      // save table to db
      await table.save();

      res.json(table);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/tables/:id
// @desc     Get single tables
// @access   Private
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

      let table = await Table.findOne(query);

      if (!table) {
        return res.status(404).send('Table not found');
      }

      res.json(table);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/tables/:id
// @desc     Update single tables
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
  ],
  async (req, res) => {
    const { name } = req.body;

    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const { access: userAccess, company } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let table = await Table.findOne(query);

      if (!table) {
        return res.status(404).send('Table not found');
      }

      table.name = name;

      // save table to db
      await table.save();

      res.json(table);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/tables/:id/release
// @desc     Release tables from bill
// @access   Public/Private
router.put(
  '/:id/release',
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
      const { access: userAccess, company } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let table = await Table.findOne(query);

      if (!table) {
        return res.status(404).send('Table not found');
      }

      const { bill } = table;

      table.bill = undefined;
      await table.save();
      res.json(table);

      if (bill) {
        // remove all bill and orders
        await Bill.findByIdAndRemove(bill);
        await Order.deleteMany({ bill });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/tables/:id
// @desc     Delete single tables
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

      let deletedTable = await Table.findOneAndRemove(query);

      if (!deletedTable) {
        return res.status(404).send('Table not found');
      }

      res.json(deletedTable);
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
