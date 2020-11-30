// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /menus              GET
// New      /menus/new          GET
// Create   /menus              POST
// Show     /menus/:id          GET
// Edit     /menus/:id/edit     GET
// Update   /menus/:id          PUT
// Delete   /menus/:id          DELETE
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

// ====================================================================================================
// Models
// ====================================================================================================
const Menu = require('../models/Menu');
const Food = require('../models/Food');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/menus
// @desc     List all menus
// @access   Private for customer and above
router.get('/', auth(true, accessLevel.customer), async (req, res) => {
  try {
    const { access, company } = req;

    let query = {
      company: access < accessLevel.wawaya ? company : req.query.company,
    };

    // foods is populated by pre find hook
    let menus = await Menu.find(query).sort({ index: 1 });

    res.json(menus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/menus
// @desc     Create new menu
// @access   Private
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    body('foods').toArray(),
    check(
      'foods.*',
      'An unexpected error occured when trying to add food to menu, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    const { name, availability, foods, company } = req.body;

    let errors = validationResult(req).array();

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    try {
      let menus = await Menu.find({ company });

      const index = menus.length + 1;

      let menu = new Menu({
        name,
        availability,
        index,
        foods,
        company: req.access < accessLevel.wawaya ? req.company : company,
      });

      await menu.save();

      res.json(menu);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/menus/:id
// @desc     Get single menu
// @access   Private
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
      const { access, company } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      // foods is populated by pre find hook
      let menu = await Menu.findOne(query);

      if (!menu) {
        return res.status(404).send('Menu not found');
      }

      res.json(menu);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/menus/:id
// @desc     Update single menu
// @access   Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    check('index', 'Index must be a whole number that is more than 0').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    body('foods').toArray(),
    check(
      'foods.*',
      'An unexpected error occured when trying to add food to menu, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
  ],
  async (req, res) => {
    let { name, availability, index: newIndex, foods } = req.body;

    let errors = validationResult(req).array();

    try {
      const { access, company: userCompanyId } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company: userCompanyId }
          : { _id: req.params.id };

      let menu = await Menu.findOne(query);

      if (!menu) {
        return res.status(404).send('Menu not found');
      }

      const { _id: menuId, index: originalIndex, company } = menu;
      newIndex = parseInt(newIndex);

      let menus = await Menu.find({ company }).sort({ index: 1 });

      if (newIndex > menus.length) {
        errors.push({
          location: 'body',
          msg: `Index cannot be more than ${menus.length}`,
          param: 'index',
        });
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      if (originalIndex !== newIndex) {
        menus = menus.filter(
          menu => menu._id.toString() !== req.params.id.toString()
        );

        if (originalIndex > newIndex) {
          menus = menus.filter(
            menu => menu.index >= newIndex && menu.index < originalIndex
          );
        } else {
          menus = menus.filter(
            menu => menu.index > originalIndex && menu.index <= newIndex
          );
        }

        let bulkOps = [];

        menus.forEach(menu => {
          bulkOps.push({
            updateOne: {
              filter: { _id: menu._id },
              update: { $inc: { index: originalIndex > newIndex ? 1 : -1 } },
            },
          });
        });

        await Menu.bulkWrite(bulkOps);
      }

      menu.name = name;
      menu.index = newIndex;
      menu.availability = availability;
      menu.foods = foods;

      await menu.save();

      res.json(menu);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/menus/:id
// @desc     Delete menu by id
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
      const { access, company: userCompanyId } = req;

      let query =
        access < accessLevel.wawaya
          ? { _id: req.params.id, company: userCompanyId }
          : { _id: req.params.id };

      const deletedMenu = await Menu.findOneAndRemove(query);

      if (!deletedMenu) {
        return res.status(404).send('Menu not found');
      }

      const { index, company } = deletedMenu;

      let menus = await Menu.find({
        company,
        index: { $gt: index },
      }).sort({ index: 1 });

      let bulkOps = [];

      menus.forEach(menu => {
        bulkOps.push({
          updateOne: {
            filter: { _id: menu._id },
            update: { $inc: { index: -1 } },
          },
        });
      });

      await Menu.bulkWrite(bulkOps);

      res.json(deletedMenu);
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
