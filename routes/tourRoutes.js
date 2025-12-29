const express = require('express');
const tokenBucketLimiter = require('../middlewares/tokenBucketLimiter');
const path = require('path');
const tourController = require(path.join(
  __dirname,
  '../controllers/tourController.js'
));
const authController = require(path.join(
  __dirname,
  '../controllers/authController.js'
));

const router = express.Router();

router
  .get(
    '/',
    authController.protect,
    tokenBucketLimiter({
      capacity: 2,
      refillRate: 0.01,
    }),
    tourController.getalltours
  )
  .get('/top5-cheap', tourController.gettopcheap, tourController.getalltours)
  .post('/', tourController.posttour)
  .get('/:id', tourController.gettourbyid)
  .patch('/:id', tourController.patchtour)
  .delete(
    '/:id',
    authController.protect,
    authController.authorise('admin'),
    tourController.deletetour
  )
  .put('/:id', tourController.puttour);

module.exports = router;
