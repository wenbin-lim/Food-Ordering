// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /foods              GET
// New      /foods/new          GET
// Create   /foods              POST
// Show     /foods/:id          GET
// Edit     /foods/:id/edit     GET
// Update   /foods/:id          PUT
// Delete   /foods/:id          DELETE
// ====================================================================================================

// ====================================================================================================
// Packages
// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, body, validationResult } = require('express-validator');
const isBase64 = require('is-base64');

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();
const accessLevel = config.get('accessLevel');
const { rootFolder: cloudinaryRootFolder } = config.get('cloudinary');

// ====================================================================================================
// Models
// ====================================================================================================
const Food = require('../models/Food');
const Menu = require('../models/Menu');
const Company = require('../models/Company');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

// ====================================================================================================
// Routes
// ====================================================================================================
// @route    GET api/foods
// @desc     List all foods
// @access   Private for staff and above
router.get('/', auth(true, accessLevel.staff), async (req, res) => {
  try {
    const { company } = req.query;

    let foods = await Food.find({ company });

    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/foods
// @desc     Create new foods
// @access   Private
router.post(
  '/',
  [
    auth(true, accessLevel.admin),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a price')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price can only accept up to 2 decimal places'),
    check('promotionPrice')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price can only accept up to 2 decimal places'),
    check('minQty', 'Value must be more than 0').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('maxQty', 'Value must be more than 0').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('portionSize')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,1' })
      .withMessage('Portion Size can only accept up to 1 decimal place'),
    body('allergics').toArray(),
    body('tags').toArray(),
    check(
      'allowAdditionalInstruction',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    body('menus').toArray(),
    check(
      'menus.*',
      'An unexpected error occured when trying to add food to menu, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
    body('customisations').toArray(),
    check(
      'customisations.*',
      'An unexpected error occured when trying to add customisation to food, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
    check(
      'company',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
  ],
  async (req, res) => {
    let {
      availability,
      name,
      price,
      promotionPrice,
      minQty,
      maxQty,
      desc,
      portionSize,
      preparationTime,
      allergics,
      tags,
      image,
      allowAdditionalInstruction,
      menus,
      customisations,
      company,
    } = req.body;

    let errors = validationResult(req).array();

    if (parseInt(maxQty) < parseInt(minQty)) {
      errors.push({
        location: 'body',
        msg: `Max value cannot be less than ${minQty}`,
        param: 'maxQty',
      });
    }

    if (image && !isBase64(image, { mimeRequired: true })) {
      errors.push({
        location: 'body',
        msg: 'Invalid image format',
        param: 'image',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json(errors);
    }

    let food = new Food({
      availability,
      name,
      price,
      promotionPrice,
      minQty,
      maxQty,
      desc,
      portionSize,
      preparationTime,
      allergics,
      tags,
      allowAdditionalInstruction,
      image,
      menus,
      customisations,
      company,
    });

    try {
      if (image) {
        let companyName = req.companyName;

        if (req.access === accessLevel.wawaya) {
          const companyObj = await Company.findById(company).select('name');

          companyName = companyObj.name;
        }

        let imageResponse = await cloudinary.uploader.upload(image, {
          public_id: `${cloudinaryRootFolder}${companyName}/Food/${name}_${food._id}`,
        });

        food.image = imageResponse.secure_url;
      }

      let bulkOps = [];

      menus.forEach(menu => {
        bulkOps.push({
          updateOne: {
            filter: { _id: menu },
            update: { $addToSet: { foods: food._id } },
          },
        });
      });

      await Menu.bulkWrite(bulkOps);

      await food.save();

      res.json(food);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/foods/:id
// @desc     Get single foods
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
      const { access: userAccess, company } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company }
          : { _id: req.params.id };

      let food = await Food.findOne(query);

      if (!food) {
        return res.status(404).send('Food not found');
      }

      res.json(food);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/foods/:id
// @desc     Update single foods
// @access   Public/Private
router.put(
  '/:id',
  [
    auth(true, accessLevel.admin),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check(
      'availability',
      'An unexpected error occured, please try again later!'
    ).isBoolean(),
    check('name', 'Please enter a name').exists({ checkFalsy: true }),
    check('price')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a price')
      .bail()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price can only accept up to 2 decimal places'),
    check('promotionPrice')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage('Price can only accept up to 2 decimal places'),
    check('minQty', 'Value must be more than 0').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('maxQty', 'Value must be more than 0').isInt({
      min: 1,
      allow_leading_zeroes: false,
    }),
    check('portionSize')
      .optional({ checkFalsy: true })
      .isDecimal({ decimal_digits: '0,1' })
      .withMessage('Portion Size can only accept up to 1 decimal place'),
    body('allergics').toArray(),
    body('tags').toArray(),
    body('menus').toArray(),
    check(
      'menus.*',
      'An unexpected error occured when trying to add food to menu, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
    body('customisations').toArray(),
    check(
      'customisations.*',
      'An unexpected error occured when trying to add customisation to food, please try again later!'
    )
      .optional({ checkFalsy: true })
      .isMongoId(),
  ],
  async (req, res) => {
    let {
      availability,
      name,
      price,
      promotionPrice,
      minQty,
      maxQty,
      desc,
      portionSize,
      preparationTime,
      allergics,
      tags,
      image,
      allowAdditionalInstruction,
      menus: newMenus,
      customisations,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      const { access: userAccess, company: userCompanyId } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company: userCompanyId }
          : { _id: req.params.id };

      let food = await Food.findOne(query).populate('company', 'name');

      if (!food) {
        return res.status(404).send('Food not found');
      }

      if (parseInt(maxQty) < parseInt(minQty)) {
        errors.push({
          location: 'body',
          msg: `Max value cannot be less than ${minQty}`,
          param: 'maxQty',
        });
      }

      if (image) {
        if (food.image !== image && !isBase64(image, { mimeRequired: true })) {
          errors.push({
            location: 'body',
            msg: 'Invalid image format',
            param: 'image',
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      if (image && image !== food.image) {
        const { company } = food;

        let imageResponse = await cloudinary.uploader.upload(image, {
          public_id: `${cloudinaryRootFolder}${company.name}/Food/${name}_${food._id}`,
          overwrite: true,
        });

        food.image = imageResponse.secure_url;
      }

      let bulkOps = [];

      const { menus: originalMenus } = food;
      let menusThatWillRemoveFood = originalMenus;
      let menusThatWillAddFood = newMenus;

      newMenus.forEach(newMenu => {
        menusThatWillRemoveFood = menusThatWillRemoveFood.filter(
          originalMenu => originalMenu.toString() !== newMenu.toString()
        );
      });

      originalMenus.forEach(originalMenu => {
        menusThatWillAddFood = menusThatWillAddFood.filter(
          newMenu => newMenu.toString() !== originalMenu.toString()
        );
      });

      menusThatWillRemoveFood.forEach(menu => {
        bulkOps.push({
          updateOne: {
            filter: { _id: menu },
            update: { $pull: { foods: food._id } },
          },
        });
      });

      menusThatWillAddFood.forEach(menu => {
        bulkOps.push({
          updateOne: {
            filter: { _id: menu },
            update: { $addToSet: { foods: food._id } },
          },
        });
      });

      await Menu.bulkWrite(bulkOps);

      food.availability = availability;
      food.name = name;
      food.price = price;
      food.promotionPrice = promotionPrice;
      food.minQty = minQty;
      food.maxQty = maxQty;
      food.desc = desc;
      food.portionSize = portionSize;
      food.preparationTime = preparationTime;
      food.allergics = allergics;
      food.tags = tags;
      food.allowAdditionalInstruction = allowAdditionalInstruction;
      food.menus = newMenus;
      food.customisations = customisations;

      await food.save();

      res.json(food);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/foods/:id
// @desc     Delete single foods
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
      const { access: userAccess, company: userCompanyId } = req;

      let query =
        userAccess < accessLevel.wawaya
          ? { _id: req.params.id, company: userCompanyId }
          : { _id: req.params.id };

      const deletedFood = await Food.findOneAndRemove(query).populate(
        'company',
        'name'
      );

      if (!deletedFood) {
        return res.status(404).send('Food not found');
      }

      res.json(deletedFood);

      const { _id: foodId, name, company, image, menus } = deletedFood;

      if (image) {
        await cloudinary.api.delete_resources_by_prefix(
          `${cloudinaryRootFolder}${company.name}/Food/${name}_${foodId}`
        );
      }

      let bulkOps = [];

      menus.forEach(menu => {
        bulkOps.push({
          updateOne: {
            filter: { _id: menu },
            update: { $pull: { foods: foodId } },
          },
        });
      });

      await Menu.bulkWrite(bulkOps);
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
