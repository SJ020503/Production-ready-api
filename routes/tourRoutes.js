const express = require('express');
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
  .get('/', authController.protect, tourController.getalltours)
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
