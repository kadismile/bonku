import express from 'express';
const router = express.Router();

// Health check route
router.get('/api/ping', function (_req, res, _next) {
  res.sendStatus(200);
});

router.get('/', function (_req, res, _next) {
  res.sendStatus(200);
});

router.get('/api/v1/access', function (_req, res, _next) {
  res.sendStatus(200);
});

module.exports = router;
