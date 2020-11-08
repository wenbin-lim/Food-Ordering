// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /bills              GET
// New      /bills/new          GET
// Create   /bills              POST
// Show     /bills/:id          GET
// Edit     /bills/:id/edit     GET
// Update   /bills/:id          PUT
// Delete   /bills/:id          DELETE
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

// ====================================================================================================
// Models
// ====================================================================================================
const Bill = require('../models/Bill');
const Food = require('../models/Food');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/bills
// @desc     List all bills
// @access   Public/Private
router.get('/', async (req, res) => {});

// @route    POST api/bills
// @desc     Create new bills
// @access   Public/Private
router.post('/', async (req, res) => {});

// @route    GET api/bills/:id
// @desc     Get single bills
// @access   Public/Private
router.get('/:id', async (req, res) => {});

// @route    PUT api/bills/:id
// @desc     Update single bills
// @access   Public/Private
router.put('/:id', async (req, res) => {});

// @route    PUT api/bills/:id/orders/new
// @desc     adding new order to bill
// @access   Private for customer
router.put(
  '/:id/orders/new',
  [
    auth(true, accessLevel.customer),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'foodId',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'foodQty',
      'An unexpected error occured, please try again later!'
    ).isInt({ min: 1, allow_leading_zeroes: false }),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();

    let {
      orderId,
      foodId,
      foodQty,
      foodPrice,
      additionalInstruction,
      customisations,
    } = req.body;

    try {
      let bill = await Bill.findById(req.params.id).populate({
        path: 'orders',
        populate: {
          path: 'customisations food',
          populate: {
            path: 'customisation customisations',
            model: 'Customisation',
          },
        },
      });

      if (!bill) {
        return res.status(404).send('Bill not found');
      }

      let food = await Food.findById(foodId).populate('customisations');
      const {
        name: foodName,
        availability: foodAvailability,
        minQty: foodMinQty,
        maxQty: foodMaxQty,
      } = food;

      if (!food || !foodAvailability) {
        return res.status(404).send(`${foodName} is currently unavailable`);
      }

      // validate foodQty
      if (parseInt(foodQty) < foodMinQty) {
        errors.push({
          location: 'body',
          msg: `Ordered quantity must be more than ${foodMinQty}`,
          param: 'foodQty',
        });
      }
      if (parseInt(foodQty) > foodMaxQty) {
        errors.push({
          location: 'body',
          msg: `Ordered quantity must be less than ${foodMaxQty}`,
          param: 'foodQty',
        });
      }

      // validate customisations
      let availableCustomisations = food.customisations;
      let selectedCustomisations = Object.entries(customisations);
      let newCustomisations = [];

      selectedCustomisations.forEach(selected => {
        const [selectedId, selectedValue] = selected;

        let found = availableCustomisations.find(
          availableCustomisation =>
            availableCustomisation._id.toString() === selectedId.toString()
        );

        const {
          availability: foundAvailability,
          optional: foundOptional,
          min: foundMin,
          max: foundMax,
        } = found;

        if (!foundAvailability) {
          errors.push({
            location: 'body',
            msg: `Currently unavailable`,
            param: selectedId,
          });
        }

        if (!foundOptional) {
          if (foundMax > 1) {
            // checkbox
            if (!Array.isArray(selectedValue)) {
              errors.push({
                location: 'body',
                msg: `Currently unavailable`,
                param: selectedId,
              });
            } else {
              const numSelectedValues = selectedValue.length;

              if (numSelectedValues === 0) {
                errors.push({
                  location: 'body',
                  msg: 'Please select an option',
                  param: selectedId,
                });
              } else if (numSelectedValues < foundMin) {
                errors.push({
                  location: 'body',
                  msg: `Please select ${
                    foundMin - numSelectedValues
                  } more option`,
                  param: selectedId,
                });
              } else if (numSelectedValues > foundMax) {
                errors.push({
                  location: 'body',
                  msg: `Please remove ${
                    numSelectedValues - foundMax
                  } more option`,
                  param: selectedId,
                });
              }
            }
          } else {
            // radio
            if (!selectedValue) {
              errors.push({
                location: 'body',
                msg: 'Please select an option',
                param: selectedId,
              });
            }
          }
        }

        let optionsChosen = [];
        if (foundMax > 1) {
          // checkbox
          optionsChosen = selectedValue.map(value => value.split(',')[0]);
        } else {
          optionsChosen.push(selectedValue.split(',')[0]);
        }

        newCustomisations.push({
          customisation: found,
          optionsChosen,
        });
      });

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      if (orderId) {
        bill.orders = bill.orders.filter(
          order => order._id.toString() !== orderId.toString()
        );
      }

      const newOrder = {
        food,
        quantity: foodQty,
        price: foodPrice,
        additionalInstruction,
        customisations: newCustomisations,
      };

      bill.orders.push(newOrder);

      await bill.save();

      res.json(bill);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/bills/:id/orders/confirm
// @desc     confirming orders, change order status from added to preparing
// @access   Private for customer
router.put(
  '/:id/orders/confirm',
  [
    auth(true, accessLevel.customer),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    body('orders').toArray(),
    check(
      'orders.*',
      'An unexpected error occured when trying to confirm orders, please try again later!'
    ),
  ],
  async (req, res) => {
    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let bill = await Bill.findById(req.params.id).populate({
        path: 'orders',
        populate: {
          path: 'customisations food',
          populate: {
            path: 'customisation customisations',
            model: 'Customisation',
          },
        },
      });

      if (!bill) {
        return res.status(404).send('Bill not found');
      }

      let { orders: ordersToBeConfirmed } = req.body;
      const { orders: billOrders } = bill;

      let ordersAlreadyConfirmed = billOrders.filter(
        order => order.status !== foodStatus.added
      );

      ordersToBeConfirmed = ordersToBeConfirmed.map(order => {
        order.status = foodStatus.preparing;
        return order;
      });

      bill.orders = ordersAlreadyConfirmed.concat(ordersToBeConfirmed);

      await bill.save();

      bill = await Bill.findById(req.params.id).populate({
        path: 'orders',
        populate: {
          path: 'customisations food',
          populate: {
            path: 'customisation customisations',
            model: 'Customisation',
          },
        },
      });

      await bill.save();

      res.json(bill);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/bills/:id
// @desc     Delete single bills
// @access   Public/Private
router.delete('/:id', async (req, res) => {});

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
