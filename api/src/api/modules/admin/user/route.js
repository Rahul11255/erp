const { Router } = require('express');
const controller = require('./controller');
const { protect } = require('../../../middlewares/user');

const router = Router({ mergeParams: true });

router.post('/google-login', controller.googleLogin);
router.get('/me', protect, controller.getMe);
router.get('/list-user', protect,   controller.listUser);

module.exports = router;