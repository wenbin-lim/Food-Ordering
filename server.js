// ====================================================================================================
// Fundamental Packages
// ====================================================================================================
const express = require('express');
const path = require('path');
const config = require('config');

// ====================================================================================================
// Fundamental Variables
// ====================================================================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ====================================================================================================
// Database setup
// ====================================================================================================
const connectDB = require('./config/db');
connectDB();

// ====================================================================================================
// Init Middlewares
// ====================================================================================================
app.use(
  express.json({
    extended: false,
    limit: '50mb',
  })
);

app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ====================================================================================================
// Define Routes
// ====================================================================================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/users', require('./routes/users'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/customisations', require('./routes/customisations'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/bills', require('./routes/bills'));

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
