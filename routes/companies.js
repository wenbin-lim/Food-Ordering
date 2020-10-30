// ====================================================================================================
// RESTful Routes
// Name      Path              HTTP Verb
// ----------------------------------------------------------------------------------------------------
// Index    /companies              GET
// New      /companies/new          GET
// Create   /companies              POST
// Show     /companies/:id          GET
// Edit     /companies/:id/edit     GET
// Update   /companies/:id          PUT
// Delete   /companies/:id          DELETE
// ====================================================================================================

// ====================================================================================================
// Packages
// ====================================================================================================
const express = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');
const isBase64 = require('is-base64');

// ====================================================================================================
// Variables
// ====================================================================================================
const router = express.Router();
const { wawaya: wawayaAccess } = config.get('accessLevel');
const { rootFolder: cloudinaryRootFolder } = config.get('cloudinary');

// ====================================================================================================
// Models
// ====================================================================================================
const Company = require('../models/Company');

// ====================================================================================================
// Miscellaneous Functions, Middlewares, Variables
// ====================================================================================================
const auth = require('../middleware/auth');
const { cloudinary } = require('../config/cloudinary');

// ====================================================================================================
// Routes
// ====================================================================================================

// @route    GET api/companies
// @desc     List all companies
// @access   Private
router.get('/', auth(false, wawayaAccess), async (req, res) => {
  try {
    let selectQuery = 'displayedName name socialMediaLinks logo';

    if (req.access === wawayaAccess) {
      selectQuery = '';
    }

    let companies = await Company.find()
      .select(selectQuery)
      .sort({ creationDate: -1 });

    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/companies
// @desc     Create new companies
// @access   Private
router.post(
  '/',
  [
    auth(true, wawayaAccess),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a name')
      .bail()
      .custom(value => /^\w(?:\w\s*(?:[.-]\w+)?)*(?<=^.{4,99})$/g.test(value))
      .withMessage(
        'Please enter a valid company name with a minimum of 4 characters'
      ),
    check('facebook', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
    check('twitter', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
    check('instagram', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
  ],
  async (req, res) => {
    const {
      name,
      facebook,
      twitter,
      instagram,
      logoLarge,
      logoSmall,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let company = await Company.findOne({
        $or: [{ displayedName: name }, { name: name.replace(/\s+/g, '') }],
      });

      // check if company with that name already exist
      if (company) {
        errors.push({
          location: 'body',
          msg: 'Company name is taken',
          param: 'name',
        });
      }

      if (logoLarge && !isBase64(logoLarge, { mimeRequired: true })) {
        errors.push({
          location: 'body',
          msg: 'Invalid image format',
          param: 'logoLarge',
        });
      }

      if (logoSmall && !isBase64(logoSmall, { mimeRequired: true })) {
        errors.push({
          location: 'body',
          msg: 'Invalid image format',
          param: 'logoSmall',
        });
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      let logo = {};
      const companyName = name.replace(/\s+/g, '');

      if (logoLarge) {
        let logoLargeResponse = await cloudinary.uploader.upload(logoLarge, {
          public_id: `${cloudinaryRootFolder}${companyName}/Logo/large`,
        });

        logo['large'] = logoLargeResponse.secure_url;
      }

      if (logoSmall) {
        let logoSmallResponse = await cloudinary.uploader.upload(logoSmall, {
          public_id: `${cloudinaryRootFolder}${companyName}/Logo/small`,
        });

        logo['small'] = logoSmallResponse.secure_url;
      }

      company = new Company({
        name: companyName,
        displayedName: name,
        socialMediaLinks: {
          facebook,
          twitter,
          instagram,
        },
        logo,
      });

      // save company to db
      await company.save();

      res.json(company);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/companies/:id
// @desc     Get single company
// @access   Private
router.get(
  '/:id',
  [
    auth(true, wawayaAccess),
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
      // get company
      let company = await Company.findById(req.params.id);

      if (!company) {
        return res.status(404).send('Company not found');
      }

      res.json(company);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/companies/:id
// @desc     Update single companies
// @access   Private
router.put(
  '/:id',
  [
    auth(true, wawayaAccess),
    check(
      'id',
      'An unexpected error occured, please try again later!'
    ).isMongoId(),
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Please enter a name')
      .bail()
      .custom(value => /^\w(?:\w\s*(?:[.-]\w+)?)*(?<=^.{4,99})$/g.test(value))
      .withMessage(
        'Please enter a valid company name with a minimum of 4 characters'
      ),
    check('facebook', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
    check('twitter', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
    check('instagram', 'Invalid URL').optional({ checkFalsy: true }).isURL(),
  ],
  async (req, res) => {
    const {
      name,
      facebook,
      twitter,
      instagram,
      logoLarge,
      logoSmall,
    } = req.body;

    let errors = validationResult(req).array();

    try {
      let company = await Company.findById(req.params.id);

      if (!company) {
        return res.status(404).send('Company not found');
      }

      if (company.displayedName !== name) {
        let companyWithNewName = await Company.findOne({
          $or: [{ displayedName: name }, { name: name.replace(/\s+/g, '') }],
        });

        if (companyWithNewName) {
          errors.push({
            location: 'body',
            msg: 'Company name is taken',
            param: 'name',
          });
        }
      }

      if (logoLarge) {
        if (
          company.logo.large !== logoLarge &&
          !isBase64(logoLarge, { mimeRequired: true })
        ) {
          errors.push({
            location: 'body',
            msg: 'Invalid image format',
            param: 'logoLarge',
          });
        }
      }

      if (logoSmall) {
        if (
          company.logo.small !== logoSmall &&
          !isBase64(logoSmall, { mimeRequired: true })
        ) {
          errors.push({
            location: 'body',
            msg: 'Invalid image format',
            param: 'logoSmall',
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      let logo = company.logo;
      const companyName = name.replace(/\s+/g, '');

      if (logoLarge && logoLarge !== company.logo.large) {
        let logoLargeResponse = await cloudinary.uploader.upload(logoLarge, {
          public_id: `${cloudinaryRootFolder}${companyName}/Logo/large`,
          overwrite: true,
        });

        logo['large'] = logoLargeResponse.secure_url;
      }

      if (logoSmall && logoSmall !== company.logo.small) {
        let logoSmallResponse = await cloudinary.uploader.upload(logoSmall, {
          public_id: `${cloudinaryRootFolder}${companyName}/Logo/small`,
          overwrite: true,
        });

        logo['small'] = logoSmallResponse.secure_url;
      }

      company.name = companyName;
      company.displayedName = name;
      company.socialMediaLinks = {
        facebook,
        twitter,
        instagram,
      };
      company.logo = logo;

      // save company to db
      await company.save();

      res.json(company);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/companies/:id
// @desc     Delete single companies
// @access   Private
router.delete(
  '/:id',
  [
    auth(true, wawayaAccess),
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
      let deletedCompany = await Company.findByIdAndRemove(req.params.id);

      if (!deletedCompany) {
        return res.status(404).send('Company not found');
      }

      res.json(deletedCompany);

      const { name } = deletedCompany;

      // delete all pictures
      cloudinary.api.delete_resources_by_prefix(
        `${cloudinaryRootFolder}${name}/`,
        (err, result) => {
          if (err) console.error(err);
          // delete folder
          cloudinary.api.delete_folder(
            `${cloudinaryRootFolder}${name}`,
            (err, result) => err && console.error(err)
          );
        }
      );

      // todo
      // need delete all users
      // need delete all bills
      // need delete all food
      // need delete all orders
      // need delete all tables
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
  }
);

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
