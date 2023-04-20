const express = require('express');
const ExpressError = require("../expressError")
const router = express.Router();
const db = require('../db');

// GET /companies
router.get('/', async (req, res, next) => {
  try {
    console.log("in companies route")
    const result = await db.query('SELECT * FROM companies');
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

// GET /companies/:code
router.get('/:code', async (req, res) => {
  
  try {
    const comp_code = req.params.code;
    const result = await db.query('SELECT * FROM companies WHERE comp_code=$1', [comp_code]);
    return res.json({company: result.rows[0]});
  } catch (err) {
    return next(err);
  }
});



// // POST /companies
// router.post('/', (req, res) => {
//   const { code, name, description } = req.body;

//   // Insert the new company into your database
//   // Example:
//   // await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)', [code, name, description]);
//   const newCompany = { code, name, description };

//   return res.status(201).json({ company: newCompany });
// });

// // PUT /companies/:code
// router.put('/:code', (req, res) => {
//   const { code } = req.params;
//   const { name, description } = req.body;

//   // Update the company with the given code in your database
//   // Example:
//   // await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3', [name, description, code]);
//   const updatedCompany = { code, name, description };

//   return res.json({ company: updatedCompany });
// });

// // DELETE /companies/:code
// router.delete('/:code', (req, res) => {
//   const { code } = req.params;

//   // Delete the company with the given code from your database
//   // Example:
//   // await db.query('DELETE FROM companies WHERE code=$1', [code]);

//   return res.json({ status: 'deleted' });
// });

module.exports = router;
