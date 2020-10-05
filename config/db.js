// @filename      db.js
// @desc          To setup MongoDB and Mongoose as DB provider

// ====================================================================================================
// Packages
// ====================================================================================================
const mongoose = require('mongoose');
const config = require('config');

// ====================================================================================================
// Variables
// ====================================================================================================
const developmentDB = config.get('mongoDevURI');
const productionDB = config.get('mongoProdURI');

// ====================================================================================================
// Setup
// ====================================================================================================
const connectDevelopmentDB = async () => {
  try {
    await mongoose.connect(developmentDB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('Development Database connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

const connectProductionDB = async () => {
  try {
    await mongoose.connect(productionDB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('Production Database connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = {
  connectDevelopmentDB,
  connectProductionDB,
};
