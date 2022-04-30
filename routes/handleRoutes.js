const router = require('express').Router();
const { publicRoom, checkForRoomId } = require('../controllers/routeController')

router.get('/', publicRoom );

router.get('/room/:roomid', checkForRoomId );

module.exports = router;