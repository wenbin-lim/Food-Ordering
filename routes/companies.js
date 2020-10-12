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
    let companies = {};

    if (req.access === wawayaAccess) {
      companies = await Company.find().sort({ creationDate: -1 });
    } else {
      companies = await Company.find().select(
        'displayedName name socialMediaLinks logo'
      );
    }

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
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .bail()
      // check if company name does not contains any illegal characters like
      .custom(value => /^\w(?:\w\s*(?:[.-]\w+)?)*(?<=^.{1,99})$/g.test(value))
      .withMessage(
        'Please enter a valid company name with a minimum of 1 character'
      ),
    check('facebook', 'Facebook link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
    check('twitter', 'Twitter link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
    check('instagram', 'Instagram link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
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
          msg: 'Company name is already taken',
          param: 'name',
        });
      }

      if (logoLarge && !isBase64(logoLarge, { mimeRequired: true })) {
        errors.push({
          location: 'body',
          msg: 'Logo Large is not valid',
          param: 'logoLarge',
        });
      }

      if (logoSmall && !isBase64(logoSmall, { mimeRequired: true })) {
        errors.push({
          location: 'body',
          msg: 'Logo Small is not valid',
          param: 'logoSmall',
        });
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      let logo = {};
      let logoLargeResponse = null;
      let logoSmallResponse = null;

      if (logoLarge) {
        logoLargeResponse = await cloudinary.uploader.upload(logoLarge, {
          folder: `${cloudinaryRootFolder}${name.replace(/\s+/g, '')}/Logo`,
          public_id: `large`,
        });

        logo['large'] = logoLargeResponse.secure_url;
      }

      if (logoSmall) {
        logoSmallResponse = await cloudinary.uploader.upload(logoSmall, {
          folder: `${cloudinaryRootFolder}${name.replace(/\s+/g, '')}/Logo`,
          public_id: `small`,
        });

        logo['small'] = logoSmallResponse.secure_url;
      }

      company = new Company({
        name,
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
router.get('/:id', auth(true, wawayaAccess), async (req, res) => {
  try {
    // get all companies
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Company not found',
          },
        ],
      });
    }

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/companies/:id
// @desc     Update single companies
// @access   Private
router.put(
  '/:id',
  [
    auth(true, wawayaAccess),
    check('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
      .bail()
      // check if company name does not contains any illegal characters like
      .custom(value => /^\w(?:\w\s*(?:[.-]\w+)?)*(?<=^.{1,99})$/g.test(value))
      .withMessage(
        'Please enter a valid company name with a minimum of 1 character'
      ),
    check('facebook', 'Facebook link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
    check('twitter', 'Twitter link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
    check('instagram', 'Instagram link is not valid URL')
      .optional({ checkFalsy: true })
      .isURL(),
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

      if (company.displayedName !== name) {
        let companyWithNewName = await Company.findOne({
          $or: [{ displayedName: name }, { name: name.replace(/\s+/g, '') }],
        });

        if (companyWithNewName) {
          errors.push({
            location: 'body',
            msg: 'Company name is already taken',
            param: 'name',
          });
        }
      }

      if (logoLarge) {
        if (
          company.logo &&
          company.logo.large !== logoLarge &&
          !isBase64(logoLarge, { mimeRequired: true })
        ) {
          errors.push({
            location: 'body',
            msg: 'Logo Large is not valid',
            param: 'logoLarge',
          });
        }
      }

      if (logoSmall) {
        if (
          company.logo &&
          company.logo.small !== logoSmall &&
          !isBase64(logoSmall, { mimeRequired: true })
        ) {
          errors.push({
            location: 'body',
            msg: 'Logo Small is not valid',
            param: 'logoSmall',
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json(errors);
      }

      let logo = company.logo;
      let logoLargeResponse = null;
      let logoSmallResponse = null;

      if (logoLarge && (!company.logo || company.logo.large !== logoLarge)) {
        logoLargeResponse = await cloudinary.uploader.upload(logoLarge, {
          folder: `${cloudinaryRootFolder}${name.replace(/\s+/g, '')}/Logo`,
          public_id: 'large',
          overwrite: true,
        });

        logo['large'] = logoLargeResponse.secure_url;
      }

      if (logoSmall && (!company.logo || company.logo.small !== logoSmall)) {
        logoSmallResponse = await cloudinary.uploader.upload(logoSmall, {
          folder: `${cloudinaryRootFolder}${name.replace(/\s+/g, '')}/Logo`,
          public_id: 'small',
          overwrite: true,
        });

        logo['small'] = logoSmallResponse.secure_url;
      }

      company.name = name;
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
router.delete('/:id', async (req, res) => {
  try {
    // get the company
    let company = await Company.findById(req.params.id);

    if (!company) {
      // company not found
      return res.status(406).send('An unexpected error occured');
    }

    // delete all resources
    cloudinary.api.delete_resources_by_prefix(
      `${cloudinaryRootFolder}${company.name}/`,
      (err, result) => {
        if (err) console.error(err);
        // delete folder
        cloudinary.api.delete_folder(
          `${cloudinaryRootFolder}${company.name}`,
          (err, result) => {
            if (err) console.error(err);
          }
        );
      }
    );

    // delete user
    await Company.findByIdAndRemove(req.params.id);

    res.json(req.params.id);
  } catch (err) {
    console.log(err);
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ====================================================================================================
// Exporting module
// ====================================================================================================
module.exports = router;
