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
// const wawayaAccessLevel = config.get('wawayaAccessLevel');
// const adminAccessLevel = config.get('adminAccessLevel');

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
router.get(
  '/',
  // auth(adminAccessLevel),
  async (req, res) => {
    try {
      // get all tables of the company
      // const { company, access } = req.user;

      // let tables = {};

      // if (access === wawayaAccessLevel) {
      tables = await Table.find().populate('company', 'name');
      // } else {
      //   tables = await Table.find({ company });
      // }

      res.json(tables);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    POST api/tables
// @desc     Create new tables
// @access   Private, admin and above only
router.post(
  '/',
  [
    // auth(adminAccessLevel),
    check('name', 'Table name is required').not().isEmpty(),
    check('company', 'Invalid Company').isMongoId(),
  ],
  async (req, res) => {
    const { name, company } = req.body;

    let errors = validationResult(req).array();

    try {
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

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
// @access   Public/Private
router.get('/:id', async (req, res) => {});

// @route    PUT api/tables/:id
// @desc     Update single tables
// @access   Public/Private
router.put('/:id', async (req, res) => {});

// @route    DELETE api/tables/:id
// @desc     Delete single tables
// @access   Public/Private
router.delete('/:id', async (req, res) => {});

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
