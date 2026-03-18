require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');

const authRoutes  = require('./routes/auth.routes');
const cvRoutes    = require('./routes/cv.routes');
const atsRoutes   = require('./routes/ats.routes');
const pdfRoutes   = require('./routes/pdf.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app  = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4000;

// ── Security & logging ──────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.vercel\.app$/,           // allow all Vercel preview deploys
  ],
  credentials: true,
}));

// ── Body parsing ────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Global rate limiter ─────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — try again in 15 minutes.' },
});
app.use('/api', limiter);

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cvs',  cvRoutes);
app.use('/api/ats',  atsRoutes);
app.use('/api/pdf',  pdfRoutes);

// ── Error handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  CV Builder API running on http://localhost:${PORT}`);
  console.log(`📊  Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;   // exported for supertest
