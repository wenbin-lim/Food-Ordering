// Packages
const express = require('express');
const config = require('config');
const { check, body, validationResult } = require('express-validator');
const endOfDayfrom = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');
const isValidObjectId = require('mongoose').isValidObjectId;

// Variables
const router = express.Router();
const accessLevel = config.get('accessLevel');
const billStatus = config.get('billStatus');
const orderStatus = config.get('orderStatus');

// Models
const Bill = require('../models/Bill');
const Order = require('../models/Order');
const Table = require('../models/Table');
const Discount = require('../models/Discount');

// Miscellaneous Functions, Middlewares, Variables
const auth = require('../middleware/auth');

// Routes

// @route    GET api/bills
// @desc     List all bills
// @access   Public/Private
router.get('/', [auth(true, accessLevel.staff)], async (req, res) => {
  try {
    const { access, company } = req;
    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
    };

    const { type } = req.query;

    if (type === 'unsettled') {
      query.status = { $ne: billStatus.settled };
    } else if (type === 'byStartTime') {
      const { startTime } = req.query;
      query.startTime = {
        $gte: startOfDay(new Date(startTime)),
        $lte: endOfDayfrom(new Date(startTime)),
      };
    }

    let bills = await Bill.find(query)
      .populate('table', 'name')
      .populate('company', 'companyCode')
      .populate('discountCode')
      .sort({ startTime: 1 });

    res.json(bills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/bills
// @desc     Create new bills
// @access   Public/Private
// router.post('/', [auth(true, accessLevel.customer)], async (req, res) => {});

// @route    GET api/bills/:id
// @desc     Get single bills
// @access   Public/Private
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
      const { access, company, bill: customerBillId } = req;

      let query = {
        _id: access > accessLevel.customer ? req.params.id : customerBillId,
      };

      if (access < accessLevel.wawaya) {
        query.company = company;
      }

      const bill = await Bill.findOne(query)
        .populate('table', 'name')
        .populate('discountCode')
        .populate('company')
        .populate('user');

      if (!bill) {
        return res.status(404).send('Bill not found');
      }

      res.json(bill);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/bills/:id
// @desc     Update single bills
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
      'paymentMethod',
      'An unexpected error occured, please try again later!'
    ).exists({ checkFalsy: true }),
    check('subTotal')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
    check('total')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
    check('gst')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
    check('serviceCharge')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
    check('roundingAmt')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
    check('discount')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Discount can only accept up to 2 decimal places'),
  ],
  async (req, res) => {
    let {
      paymentMethod,
      discountCode,
      subTotal,
      total,
      gst,
      serviceCharge,
      discount,
      discountCodeValue,
      roundingAmt,
      status,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      const { access, company, bill: customerBillId } = req;

      let query = {
        company: access < accessLevel.wawaya ? company : req.query.company,
        _id: access > accessLevel.customer ? req.params.id : customerBillId,
      };

      const bill = await Bill.findOne(query).populate(
        'company',
        'acceptedPaymentMethods companyCode'
      );

      if (!bill) {
        return res.status(404).send('Bill not found');
      }

      // validate payment methods
      const {
        company: { acceptedPaymentMethods },
        status: currentBillStatus,
      } = bill;

      if (acceptedPaymentMethods.indexOf(paymentMethod) < 0) {
        errors.push({
          location: 'body',
          msg: `Payment method not accepted by company`,
          param: 'paymentMethod',
        });
      }

      // validate discount code for customer
      if (discountCode) {
        // check if from customer or cashier
        let discountQuery = {
          company: access < accessLevel.wawaya ? company : req.query.company,
        };

        if (isValidObjectId(discountCode)) {
          discountQuery._id = discountCode;
        } else {
          discountQuery.code = { $regex: new RegExp(`^${discountCode}$`, 'i') };
        }

        const validDiscount = await Discount.findOne(discountQuery);

        if (!validDiscount) {
          errors.push({
            location: 'body',
            msg: `Invalid Discount Code`,
            param: 'discountCode',
          });
        } else {
          // check if min spending fulfils
          const servedOrders = await Order.find({
            currentStatus: orderStatus.served,
            bill: req.params.id,
          });

          let servedOrdersTotalPrice = servedOrders.reduce(
            (result, item) => (result += item.price),
            0
          );

          // brief checking of price only, this price will not be final
          const { minSpending } = validDiscount;

          if (servedOrdersTotalPrice < minSpending) {
            errors.push({
              location: 'body',
              msg: `You do not fulfil the minimum spending of $${minSpending.toFixed(
                2
              )}`,
              param: 'discountCode',
            });
          } else {
            discountCode = [validDiscount];
          }
        }
      }

      // validate status
      if (status) {
        if (!billStatus[status]) {
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

      if (status === billStatus.settled) {
        // check all orders are either served, cancelled or removed
        const orders = await Order.find({ bill: req.params.id });
        let validateOrders = true;

        orders.forEach(({ currentStatus }) => {
          if (
            currentStatus === orderStatus.new ||
            currentStatus === orderStatus.preparing ||
            currentStatus === orderStatus.cooking ||
            currentStatus === orderStatus.hold ||
            currentStatus === orderStatus.updated ||
            currentStatus === orderStatus.ready ||
            currentStatus === orderStatus.rejected
          ) {
            validateOrders = false;
          }
        });

        if (!validateOrders) {
          return res
            .status(406)
            .json({ msg: 'Orders are outdated', actionName: 'refetch' });
        }

        // remove bill from table
        const table = await Table.findById(bill.table);

        if (!table) {
          return res
            .status(404)
            .send('An unexpected error occured, please try again later!');
        }

        table.bill = undefined;
        await table.save();

        bill.endTime = new Date();
        bill.user = req.user;
      }

      bill.subTotal = subTotal ? subTotal : 0;
      bill.total = total ? total : 0;
      bill.discount = discount ? discount : 0;
      bill.discountCodeValue = discountCodeValue ? discountCodeValue : 0;
      bill.serviceCharge = serviceCharge ? serviceCharge : 0;
      bill.gst = gst ? gst : 0;
      bill.roundingAmt = roundingAmt ? roundingAmt : 0;
      bill.paymentMethod = paymentMethod;
      bill.discountCode = discountCode ? discountCode : undefined;
      bill.status = status;

      if (
        currentBillStatus !== billStatus.settled &&
        status === billStatus.settled
      ) {
        // add new invoice no
        const companySettledBills = await Bill.find({
          company: access < accessLevel.wawaya ? company : req.query.company,
          status: billStatus.settled,
        });

        bill.invoiceNo = companySettledBills.length + 1;
      }

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

      let deletedBill = await Bill.findOneAndRemove(query);

      if (!deletedBill) {
        return res.status(404).send('Bill not found');
      }

      if (deletedBill.invoiceNo) {
        await Bill.updateMany(
          {
            company: deletedBill.company,
            invoiceNo: { $gt: deletedBill.invoiceNo },
          },
          {
            $inc: { invoiceNo: -1 },
          }
        );
      }

      res.json(deletedBill);
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
