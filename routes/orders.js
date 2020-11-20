// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /orders              GET
// New      /orders/new          GET
// Create   /orders              POST
// Show     /orders/:id          GET
// Edit     /orders/:id/edit     GET
// Update   /orders/:id          PUT
// Delete   /orders/:id          DELETE
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
const foodStatus = config.get('foodStatus');
const ordersEditTypes = config.get('ordersEditTypes');
const ObjectId = require('mongoose').Types.ObjectId;

// ====================================================================================================
// Models
// ====================================================================================================
const Order = require('../models/Order');
const Food = require('../models/Food');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/orders
// @desc     List all orders
// @access   Public/Private
router.get('/', [auth(true, accessLevel.customer)], async (req, res) => {
  try {
    const { access } = req;
    const { company, bill } = req.query;
    let query = {};

    if (access > accessLevel.customer) {
      query = { company };
    } else {
      query = { bill };
    }

    let orders = await Order.find(query);

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/orders
// @desc     Create new orders
// @access   Public/Private
router.post(
  '/',
  [
    auth(true, accessLevel.customer),
    check(
      'bill',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'food',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'quantity',
      'An unexpected error occured, please try again later!'
    ).isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('price')
      .exists({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('An unexpected error occured, please try again later!'),
  ],
  async (req, res) => {
    let {
      food,
      quantity,
      customisationsUsed,
      additionalInstruction,
      price,
      bill,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let foundFood = await Food.findById(food);

      if (!foundFood) {
        return res.status(404).send('Food not found');
      }

      // validate quantity
      const { minQty, maxQty, customisations } = foundFood;

      if (quantity < minQty) {
        errors.push({
          location: 'body',
          msg: `Please order ${minQty - quantity} more unit`,
          param: 'quantity',
        });
      }

      if (quantity > maxQty) {
        errors.push({
          location: 'body',
          msg: `Please order ${quantity - maxQty} lesser unit`,
          param: 'quantity',
        });
      }

      // validate customisations
      customisationsUsed.forEach(thisCustomisationUsed => {
        const {
          customisation: customisationUsed,
          optionsSelected,
        } = thisCustomisationUsed;

        const foundCustomisation = customisations.find(
          customisation =>
            customisation._id.toString() === customisationUsed._id.toString()
        );

        const { availability, optional, min, max } = foundCustomisation;

        // check availability
        if (!availability) {
          errors.push({
            location: 'body',
            msg: `Currently unavailable`,
            param: customisationUsed._id,
          });
        }

        // check if required
        if (!optional) {
          if (!Array.isArray(optionsSelected)) {
            errors.push({
              location: 'body',
              msg: 'An unexpected error occured, please try again later!',
              param: 'customisationUsed',
            });
          }

          const numOptionsSelected = optionsSelected.length;
          let msg = '';

          if (numOptionsSelected < min) {
            msg = `Please select ${min - numOptionsSelected} more option`;
          } else if (numOptionsSelected > max) {
            msg = `Please select ${max - numOptionsSelected} lesser option`;
          }

          if (msg) {
            errors.push({
              location: 'body',
              msg,
              param: customisationUsed._id,
            });
          }
        }
      });

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const order = new Order({
        food,
        quantity,
        customisationsUsed,
        additionalInstruction,
        price,
        status: foodStatus.added,
        bill,
        company: req.company,
      });

      await order.save();

      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/orders
// @desc     Update single orders
// @access   Public/Private
router.put('/', [auth(true, accessLevel.customer)], async (req, res) => {
  const { editType, orders } = req.body;

  if (editType === ordersEditTypes.confirmingOrders) {
    try {
      if (!Array.isArray(orders)) {
        return res
          .status(400)
          .send('An unexpected error occured, please try again later!');
      } else {
        let orderIds = orders.map(order => new ObjectId(order._id));

        await Order.updateMany(
          {
            _id: { $in: orderIds },
          },
          {
            $set: { status: foodStatus.preparing },
          }
        );

        return res.status(200).send('Orders confirmed!');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  } else if (editType === 'somethingelese') {
  } else {
    console.error('Edit Type is invalid');
    res.status(500).send('Server Error');
  }
});

// @route    GET api/orders/:id
// @desc     Get single orders
// @access   Public/Private
router.get('/:id', async (req, res) => {});

// @route    PUT api/orders/:id
// @desc     Update single orders
// @access   Public/Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.customer),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'bill',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'food',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'quantity',
      'An unexpected error occured, please try again later!'
    ).isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('price')
      .exists({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('An unexpected error occured, please try again later!'),
  ],
  async (req, res) => {
    let {
      food,
      quantity,
      customisationsUsed,
      additionalInstruction,
      price,
      status,
      bill,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let order = await Order.findOne({
        _id: req.params.id,
        company: req.company,
        bill,
      });

      if (!order) {
        return res.status(404).send('Order not found');
      }

      let foundFood = await Food.findById(food);

      if (!foundFood) {
        return res.status(404).send('Food not found');
      }

      // validate quantity
      const { minQty, maxQty, customisations } = foundFood;
      // quantity = parseInt(quantity);

      if (quantity < minQty) {
        errors.push({
          location: 'body',
          msg: `Please order ${minQty - quantity} more unit`,
          param: 'quantity',
        });
      }

      if (quantity > maxQty) {
        errors.push({
          location: 'body',
          msg: `Please order ${quantity - maxQty} lesser unit`,
          param: 'quantity',
        });
      }

      // validate customisations
      customisationsUsed.forEach(thisCustomisationUsed => {
        const {
          customisation: customisationUsed,
          optionsSelected,
        } = thisCustomisationUsed;

        const foundCustomisation = customisations.find(
          customisation =>
            customisation._id.toString() === customisationUsed._id.toString()
        );

        const { availability, optional, min, max } = foundCustomisation;

        // check availability
        if (!availability) {
          errors.push({
            location: 'body',
            msg: `Currently unavailable`,
            param: customisationUsed._id,
          });
        }

        // check if required
        if (!optional) {
          if (!Array.isArray(optionsSelected)) {
            errors.push({
              location: 'body',
              msg: 'An unexpected error occured, please try again later!',
              param: 'customisationUsed',
            });
          }

          const numOptionsSelected = optionsSelected.length;
          let msg = '';

          if (numOptionsSelected < min) {
            msg = `Please select ${min - numOptionsSelected} more option`;
          } else if (numOptionsSelected > max) {
            msg = `Please select ${max - numOptionsSelected} lesser option`;
          }

          if (msg) {
            errors.push({
              location: 'body',
              msg,
              param: customisationUsed._id,
            });
          }
        }
      });

      if (status) {
        if (!foodStatus[status]) {
          errors.push({
            location: 'body',
            msg: 'An unexpected error occured, please try again later!',
            param: 'status',
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      order.quantity = quantity;
      order.additionalInstruction = additionalInstruction;
      order.customisationsUsed = customisationsUsed;
      order.price = price;
      order.status = status ? status : foodStatus.added;

      await order.save();

      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/orders/:id
// @desc     Delete single orders
// @access   Public/Private
router.delete(
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
      let deletedOrder = await Order.findOneAndRemove({
        _id: req.params.id,
        company: req.company,
      });

      if (!deletedOrder) {
        return res.status(404).send('Order not found');
      }

      res.json(deletedOrder);
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
