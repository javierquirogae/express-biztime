/** BizTime express application. */

const express = require("express");
const app = express();
const ExpressError = require("./expressError")

// Middleware to parse JSON request bodies
app.use(express.json());

const companiesRouter = require('./routes/companies');
const invoicesRouter = require('./routes/invoices');


// Mount the companies router at the /companies path
app.use('/companies', companiesRouter);

// Mount the invoices router at the /invoices path
app.use('/invoices', invoicesRouter);



/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
