//imported modules
const express = require('express')
const app = express()
const router = express.Router()

//render homepage
exports.HomeUI = (req,res)=>{
    res.render('home.ejs')
}

//render login page
exports.LoginUI = (req,res)=>{
    res.render('login.ejs')
}

//render sign-up page
exports.SignUpUI = (req,res)=>{
    res.render('sign-up.ejs')
}

//render game page
exports.GameUI = (req,res)=>{
    res.render('game.ejs')
}

//renedr dashboard page
exports.DashboardUI = (req,res)=>{
    res.render('dashboard.ejs')
}