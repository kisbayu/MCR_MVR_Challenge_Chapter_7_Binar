//imported modules
const express = require('express');
const router = express.Router();
const app = express();
const user = require('../controllers/controller')

router.get('/', user.HomeUI)                //route to homepage
router.get('/login', user.LoginUI)          //route to login page
router.get('/sign-up', user.SignUpUI)       //route to sign-up page
router.get('/game', user.GameUI)            //route to game page
router.get('/dashboard', user.DashboardUI)  //route to dashboard page
router.get('/edit/:id', user.editUI)        //routes to edit page
router.post('/sing-up', user.CreateUser)    //create user
router.post('/login', user.Userlogin)       //user login account
router.post('/edit/:id', user.editUser)

module.exports = router