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

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();

// ====================================================================================================
// Models
// ====================================================================================================

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/documentName
// @desc     List all documents
// @access   Public/Private
router.get('/', (req, res) => {});

// @route    POST api/documentName
// @desc     Create new document
// @access   Public/Private
router.post('/', (req, res) => {});

// @route    GET api/documentName/:documentId
// @desc     Get single document
// @access   Public/Private
router.get('/:id', (req, res) => {});

// @route    PUT api/documentName/:documentId
// @desc     Update single document
// @access   Public/Private
router.put('/:id', (req, res) => {});

// @route    DELETE api/documentName/:documentId
// @desc     Delete single document
// @access   Public/Private
router.delete('/:id', (req, res) => {});

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
