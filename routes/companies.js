const express = require('express');
const router = express.Router();

// Import your database module and any necessary middleware here

// GET /companies
router.get('/', (req, res) => {
  // Query your database to get a list of companies
  // Example:
  // const result = await db.query('SELECT code, name FROM companies');
  // const companies = result.rows;
  const companies = [{ code: 'ABC', name: 'ABC Company' }, { code: 'XYZ', name: 'XYZ Company' }];

  return res.json({ companies });
});

// GET /companies/:code
router.get('/:code', (req, res) => {
  const { code } = req.params;

  // Query your database to get the company with the given code
  // Example:
  // const result = await db.query('SELECT code, name, description FROM companies WHERE code=$1', [code]);
  // const company = result.rows[0];
  const company = { code: 'ABC', name: 'ABC Company', description: 'A great company!' };

  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  return res.json({ company });
});

// POST /companies
router.post('/', (req, res) => {
  const { code, name, description } = req.body;

  // Insert the new company into your database
  // Example:
  // await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)', [code, name, description]);
  const newCompany = { code, name, description };

  return res.status(201).json({ company: newCompany });
});

// PUT /companies/:code
router.put('/:code', (req, res) => {
  const { code } = req.params;
  const { name, description } = req.body;

  // Update the company with the given code in your database
  // Example:
  // await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3', [name, description, code]);
  const updatedCompany = { code, name, description };

  return res.json({ company: updatedCompany });
});

// DELETE /companies/:code
router.delete('/:code', (req, res) => {
  const { code } = req.params;

  // Delete the company with the given code from your database
  // Example:
  // await db.query('DELETE FROM companies WHERE code=$1', [code]);

  return res.json({ status: 'deleted' });
});

module.exports = router;
