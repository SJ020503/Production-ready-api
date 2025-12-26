const express = require('express');
const path = require('path');
const authController = require(path.join(
  __dirname,
  '../controllers/authController.js'
));

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.validateLogin, authController.login);
router.post('/logout', authController.logout);
// router
//   .get('/', tourController.getalltours)
//   .get('/top5-cheap', tourController.gettopcheap, tourController.getalltours)
//   .post('/', tourController.posttour)
//   .get('/:id', tourController.gettourbyid)
//   .patch('/:id', tourController.patchtour)
//   .delete('/:id', tourController.deletetour)
//   .put('/:id', tourController.puttour);

module.exports = router;
