const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.js");
const positionController = require("../controllers/position.js");
const positionReadyController = require("../controllers/position_ready.js");
const upload = require("../utils/uploads.js")

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/isLogin', userController.isLogin);
router.get('/logout', userController.logout);

router.post('/addPosition', upload.single('logo'), positionController.addPosition);
router.get('/getPositionList', positionController.getPositionList);
router.get('/removePosition', positionController.removePosition);
router.get('/getPosition', positionController.getPosition);
router.post('/updatePosition', upload.single('logo'), positionController.updatePosition);
router.get('/salarySuit', positionController.salarySuit);

router.post('/addPositionReady', upload.single('logo'), positionReadyController.addPositionReady);
router.get('/getPositionListReady', positionReadyController.getPositionListReady);
router.get('/removePositionReady', positionReadyController.removePositionReady);
router.get('/getPositionReady', positionReadyController.getPositionReady);
router.post('/updatePositionReady', upload.single('logo'), positionReadyController.updatePositionReady);



module.exports = router;
