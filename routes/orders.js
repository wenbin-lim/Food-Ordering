// Packages
const express = require('express');
const config = require('config');
const { check, body, validationResult } = require('express-validator');

// Variables
const router = express.Router();
const accessLevel = config.get('accessLevel');
const orderStatus = config.get('orderStatus');
const ordersEditTypes = config.get('ordersEditTypes');
const ObjectId = require('mongoose').Types.ObjectId;

// Models
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const Bill = require('../models/Bill');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');

// Routes
// @route    GET api/orders
// @desc     List all orders
// @access   Public/Private
router.get('/', [auth(true, accessLevel.customer)], async (req, res) => {
  try {
    const { access, company } = req;

    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
      bill: access > accessLevel.customer ? req.query.bill : req.bill,
    };
    let orders = await Order.find(query).sort({ date: -1 });

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
    check('food', 'An unexpected error occured, please try again later!')
      .optional({ checkFalsy: true })
      .isMongoId(),
    check('quantity', 'An unexpected error occured, please try again later!')
      .optional({ checkFalsy: true })
      .isInt({
        min: 1,
        allow_leading_zeroes: false,
      }),
    check('price')
      .exists({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price can only accept up to 2 decimal places'),
    check('bill', 'An unexpected error occured, please try again later!')
      .optional({ checkFalsy: true })
      .isMongoId(),
  ],
  async (req, res) => {
    let {
      food,
      isAdditionalItem,
      additionalItemName,
      quantity,
      customisationsUsed,
      additionalInstruction,
      price,
      bill,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      if (isAdditionalItem) {
        if (additionalItemName === '') {
          errors.push({
            location: 'body',
            msg: 'Please enter a name',
            param: 'additionalItemName',
          });
        }
      } else {
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
                msg: '',
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
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      const order = new Order({
        food,
        quantity,
        customisationsUsed,
        additionalInstruction,
        isAdditionalItem,
        additionalItemName,
        price,
        company: req.company,
        bill: bill ? bill : req.bill,
      });

      // added by staff
      if (req.access > accessLevel.customer) {
        order.currentStatus = orderStatus.preparing;
        order.activities = [
          {
            status: orderStatus.preparing,
            user: req.user,
          },
        ];
      } else {
        // added by customer
        order.currentStatus = orderStatus.new;
        order.activities = [{ status: orderStatus.new }];
      }

      await order.save();

      res.json(order);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/orders
// @desc     Update orders
// @access   Public/Private
router.put('/', [auth(true, accessLevel.customer)], async (req, res) => {
  const { editType, orders, bill } = req.body;

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
            company: req.company,
            bill: bill ? bill : req.bill,
          },
          {
            $set: { currentStatus: orderStatus.preparing },
            $push: { activities: { status: orderStatus.preparing } },
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
    check('food', 'An unexpected error occured, please try again later!')
      .optional({ checkFalsy: true })
      .isMongoId(),
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
      .withMessage('Price can only accept up to 2 decimal places'),
    check('bill', 'An unexpected error occured, please try again later!')
      .optional({ checkFalsy: true })
      .isMongoId(),
  ],
  async (req, res) => {
    let {
      food,
      isAdditionalItem,
      additionalItemName,
      quantity,
      customisationsUsed,
      additionalInstruction,
      price,
      currentStatus: newStatus,
      bill,
      remarks,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let order = await Order.findOne({
        _id: req.params.id,
        company: req.company,
        bill: bill ? bill : req.bill,
      });

      if (!order) {
        return res.status(404).send('Order not found');
      }

      if (isAdditionalItem) {
        if (additionalItemName === '') {
          errors.push({
            location: 'body',
            msg: 'Please enter a name',
            param: 'additionalItemName',
          });
        }
      } else {
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
      }

      if (newStatus) {
        if (!orderStatus[newStatus]) {
          errors.push({
            location: 'body',
            msg: 'An unexpected error occured, please try again later!',
            param: 'currentStatus',
          });
        }
      }

      if (errors.length > 0) {
        console.log(errors);
        return res.status(400).json(errors);
      }

      order.additionalItemName = additionalItemName;
      order.quantity = quantity;
      order.additionalInstruction = additionalInstruction;
      order.customisationsUsed = customisationsUsed;
      order.price = price;

      if (req.access > accessLevel.customer) {
        order.currentStatus = newStatus;
        order.activities.push({
          status: newStatus,
          remarks,
          user: req.user,
        });
      }

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
      const { access, company } = req;

      let query = {
        _id: req.params.id,
      };

      if (access < accessLevel.wawaya) {
        query.company = company;

        if (access === accessLevel.customer) {
          query.bill = req.bill;
        }
      }

      let deletedOrder = await Order.findOneAndRemove(query);

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
