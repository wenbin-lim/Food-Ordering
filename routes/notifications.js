// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, body, validationResult } = require('express-validator');

// Variables
const router = express.Router();
const accessLevel = config.get('accessLevel');

// Models
const Notification = require('../models/Notification');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');

// Routes

// @route    GET api/notifications
// @desc     List all notifications
// @access   Public/Private
router.get('/', auth(true, accessLevel.staff), async (req, res) => {
  try {
    const { access, company, userRole } = req;

    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
      forWho: { $in: userRole },
    };

    let notifications = await Notification.find(query).sort({ time: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/notifications
// @desc     Create new notifications
// @access   Public/Private
router.post(
  '/',
  [
    auth(true, accessLevel.customer),
    check(
      'type',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    body('forWho').toArray(),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();

    const {
      type,
      forWho,
      tableName,
      foodName,
      optionsSelected,
      additionalInstruction,
      remarks,
      assistanceReason,
    } = req.body;

    if (forWho.length === 0) {
      errors.push({
        location: 'body',
        msg: 'An unexpected error occured, please try again later!',
        param: 'forWho',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      const notification = new Notification({
        type,
        forWho,
        content: {
          tableName,
          remarks,
          foodName,
          optionsSelected,
          additionalInstruction,
          assistanceReason,
        },
        company: req.company,
      });

      await notification.save();

      res.json(notification);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/notifications/:id
// @desc     Get single notifications
// @access   Public/Private
router.get('/:id', async (req, res) => {});

// @route    PUT api/notifications/:id
// @desc     Update single notifications
// @access   Public/Private
router.put('/:id', async (req, res) => {});

// @route    DELETE api/notifications/:id
// @desc     Delete single notifications
// @access   Public/Private
router.delete(
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

      let deletedNotification = await Notification.findOneAndRemove(query);

      res.json(deletedNotification);
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
