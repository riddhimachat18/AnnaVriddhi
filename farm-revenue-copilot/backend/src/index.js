'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const irrigationRoutes    = require('./routes/irrigation');
const gradingRoutes       = require('./routes/grading');
const schemesRoutes       = require('./routes/schemes');
const recommendationRoutes = require('./routes/recommendations');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ──
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ──
app.use('/api/irrigation',      irrigationRoutes);
app.use('/api/grading',         gradingRoutes);
app.use('/api/schemes',         schemesRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ── Health check ──
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── 404 handler ──
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ── Global error handler ──
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[server] Farm Revenue Copilot API running on http://localhost:${PORT}`);
});

module.exports = app;
