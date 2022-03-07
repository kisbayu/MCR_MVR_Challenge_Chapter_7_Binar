const expres = require('express')
const router = expres.Router()
const user = require('../controllers/controller')
const verifyToken = require('../middleware/verifyToken')

router.post('/register', user.Register)                     //route to register new user
router.post('/login', user.Login)                           //route to user login
router.post('/room/create', verifyToken, user.CrateRoom)    //route to create room
router.post('/room/play', verifyToken, user.PlayGame)       //route to play game


module.exports = router