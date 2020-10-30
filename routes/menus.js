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
    const { company } = req.query;

    let menus = await Menu.find({
      company,
    })
      .sort({ index: 1 })
      .populate({
        path: 'foods',
        populate: {
          path: 'customisations',
        },
      });

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
    check(
      'isMain',
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
    const { name, availability, isMain, foods, company } = req.body;

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
        isMain,
        foods,
        company,
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
      let menu = await Menu.findById(req.params.id)
        .populate('company', 'displayedName')
        .populate('foods');

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
    check(
      'isMain',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),

    body('foods').toArray(),
    check(
      'foods.*',
      'An unexpected error occured when trying to add food to menu, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
  ],
  async (req, res) => {
    let {
      name,
      availability,
      index: newIndex,
      isMain,
      foods: newFoods,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let menu = await Menu.findById(req.params.id);

      if (!menu) {
        return res.status(404).send('Menu not found');
      }

      const {
        _id: menuId,
        index: originalIndex,
        company,
        foods: originalFoods,
      } = menu;
      newIndex = parseInt(newIndex);

      let menus = await Menu.find({ company }).sort({ index: 1 });

      if (newIndex > menus.length) {
        errors.push({
          location: 'body',
          msg: `Index cannot be more than ${foodgroups.length}`,
          param: 'sidebarIndex',
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

      let bulkOps = [];
      let removedFoods = originalFoods;
      let addedFoods = newFoods;

      newFoods.forEach(newFood => {
        removedFoods = removedFoods.filter(
          originalFood => originalFood.toString() !== newFood.toString()
        );
      });

      originalFoods.forEach(originalFood => {
        addedFoods = addedFoods.filter(
          newFood => newFood.toString() !== originalFood.toString()
        );
      });

      removedFoods.forEach(food => {
        bulkOps.push({
          updateOne: {
            filter: { _id: food },
            update: { $pull: { menus: menuId } },
          },
        });
      });

      addedFoods.forEach(food => {
        bulkOps.push({
          updateOne: {
            filter: { _id: food },
            update: { $addToSet: { menus: menuId } },
          },
        });
      });

      await Food.bulkWrite(bulkOps);

      menu.name = name;
      menu.index = newIndex;
      menu.availability = availability;
      menu.isMain = isMain;
      menu.foods = newFoods;

      await menu.save();

      let newMenus = await Menu.find({ company }).sort({ index: 1 });

      // return entire menus since the sorting will be changed
      res.json(newMenus);
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
      const deletedMenu = await Menu.findByIdAndRemove(req.params.id);

      if (!deletedMenu) {
        return res.status(404).send('Menu not found');
      }

      const { index, name: deletedMenuName, company } = deletedMenu;

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

      menus = await Menu.find({ company }).sort({ index: 1 });

      res.json({
        menus,
        deletedMenuName,
      });

      await Food.updateMany(
        { menus: req.params.id },
        {
          $pull: { menus: req.params.id },
        }
      );
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
