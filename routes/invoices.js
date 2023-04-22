const express = require('express');
const ExpressError = require("../expressError")
const router = express.Router();
const db = require('../db');

// GET /invoices
// Returns info on invoices
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM invoices');
    return res.json({invoices: result.rows});
  } catch (err) {
    return next(err);
  }
});

// GET /invoices/:id
// Returns obj on given invoice
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.code, c.name, c.description 
      FROM invoices AS i 
      INNER JOIN companies AS c ON (i.comp_code = c.code) 
      WHERE id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({message: 'Invoice not found'});
    }

    const data = result.rows[0];
    const invoice = {
      id: data.id,
      amt: data.amt,
      paid: data.paid,
      add_date: data.add_date,
      paid_date: data.paid_date,
      company: {
        code: data.code,
        name: data.name,
        description: data.description
      }
    };

    return res.json({invoice});
  } catch (err) {
    return next(err);
  }
});

// POST /invoices
// Adds an invoice
router.post('/', async (req, res, next) => {
  try {
    const result = await db.query(`
      INSERT INTO invoices (comp_code, amt) 
      VALUES ($1, $2) 
      RETURNING id, comp_code, amt, paid, add_date, paid_date
    `, [req.body.comp_code, req.body.amt]);

    return res.status(201).json({invoice: result.rows[0]});
  } catch (err) {
    return next(err);
  }
});

// PATCH /invoices/:id
// Updates an invoice
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await db.query(`
      UPDATE invoices 
      SET amt = $1 
      WHERE id = $2 
      RETURNING id, comp_code, amt, paid, add_date, paid_date
    `, [req.body.amt, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({message: 'Invoice not found'});
    }

    return res.json({invoice: result.rows[0]});
  } catch (err) {
    return next(err);
  }
});



router.put('/:id', async function(req, res, next) {
  try {
    const { amt, paid } = req.body;
    let paidDate = null;
    const result = await db.query(
      'SELECT * FROM invoices WHERE id=$1',
      [req.params.id]
    );
    const invoice = result.rows[0];
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (paid && !invoice.paid) {
      paidDate = new Date();
    } else if (!paid && invoice.paid) {
      paidDate = null;
    } else {
      paidDate = invoice.paid_date;
    }
    const updateResult = await db.query(
      'UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING *',
      [amt, paid, paidDate, req.params.id]
    );
    const updatedInvoice = updateResult.rows[0];
    return res.json({ invoice: updatedInvoice });
  } catch (err) {
    return next(err);
  }
});




// DELETE /invoices/:id
// Deletes an invoice
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({message: 'Invoice not found'});
    }

    return res.json({status: 'deleted'});
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
