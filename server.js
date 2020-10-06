// ====================================================================================================
// Fundamental Packages
// ====================================================================================================
const express = require('express');
const path = require('path');

// ====================================================================================================
// Fundamental Variables
// ====================================================================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ====================================================================================================
// Database setup
// ====================================================================================================
const db = require('./config/db');

// Note:
// Please remember to create 2 database (development & production) inside MongoDB Atlas
// Change the production and development URI inside default.json as well
if (process.env.PORT) {
  db.connectProductionDB();
} else {
  db.connectDevelopmentDB();
}

// ====================================================================================================
// Init Middlewares
// ====================================================================================================
app.use(
  express.json({
    extended: false,
  })
);
// ====================================================================================================
// Define Routes
// ====================================================================================================
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

// ====================================================================================================
// Serve Static assets in production
// ====================================================================================================
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  // Serve index.html from build folder
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// ====================================================================================================
// App Listen to Server PORT
// ====================================================================================================
app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
