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
router.get('/:code', async (req, res, next) => {
  
  try {
    console.log("in company route")
    const comp_code = req.params.code;
    const response = await db.query('SELECT * FROM companies WHERE code=$1', [comp_code]);
    return res.json({company: response.rows[0]});
  } catch (err) {
    return next(err);
  }
});



// POST /companies
router.post('/', async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const response = await db.query(
          `INSERT INTO companies (code, name, description) 
          VALUES ($1, $2, $3) RETURNING code, name, description`, [
            code, name, description
          ]);
    return res.status(201).json({company: response.rows[0]});


  } catch (err) {
    return next(err)
  }
});

// PATCH /companies/:code
router.patch('/:code', async (req, res, next) => {
  try{
    const { code } = req.params;
    const { name, description } = req.body;

    // Update the company with the given code in your database
    
    const response = await db.query(
        `UPDATE companies SET name=$1, description=$2 WHERE code=$3`
        , [name, description, code]);
    return res.status(202).json({company: response.rows[0]});

  } catch (err) {
    return next(err)
  }
});

// DELETE /companies/:code
router.delete('/:code', async (req, res, next ) => {
  const { code } = req.params;
  try{

  // Delete the company with the given code from your database

  const response = await db.query('DELETE FROM companies WHERE code=$1', [code]);

  return res.json({ status: 'deleted' });
  } catch (err) {
    return next(err)
  } 
});

module.exports = router;
