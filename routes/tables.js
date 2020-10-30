// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /tables              GET
// New      /tables/new          GET
// Create   /tables              POST
// Show     /tables/:id          GET
// Edit     /tables/:id/edit     GET
// Update   /tables/:id          PUT
// Delete   /tables/:id          DELETE
// ====================================================================================================

// ====================================================================================================
// Packages
// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();
const accessLevel = config.get('accessLevel');

// ====================================================================================================
// Models
// ====================================================================================================
const Table = require('../models/Table');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/tables
// @desc     List all tables
// @access   Private, admin and above only
router.get('/', auth(true, accessLevel.admin), async (req, res) => {
  try {
    const { company } = req.query;

    let tables = await Table.find({ company }).sort({
      creationDate: -1,
    });

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
        company,
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
      let table = await Table.findById(req.params.id).populate(
        'company',
        'displayedName'
      );

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
      let table = await Table.findById(req.params.id);

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
      let deletedTable = await Table.findByIdAndRemove(req.params.id);

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
