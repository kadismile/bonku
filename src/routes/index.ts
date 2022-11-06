import express from 'express';
const router = express.Router();

// Health check route
router.get('/api/ping', function (req, res, next) {
  res.sendStatus(200);
});

router.get('/', function (req, res, next) {
  res.sendStatus(200);
});

router.get('/api/v1/access', function (req, res, next) {
  res.sendStatus(201);
});

module.exports = router;
