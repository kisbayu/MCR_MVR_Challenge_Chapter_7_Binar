//imported modules
const {UserClient} = require('../models')
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

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

//render dashboard page
exports.DashboardUI = async (req,res)=>{
    const user = await UserClient.findAll()
    res.render('dashboard.ejs',{
        data: user
    })
}

//render edit page
exports.editUI = async(req,res)=>{
    const {id} = req.params
    const editUser = await UserClient.findOne({
        where: {
            uuid: id
        }
    })
    res.render('edit.ejs',{
        data: editUser
    })
}

//crete new user
exports.CreateUser = async (req,res)=>{
    const{name, email, password, role} = req.body
        await UserClient.create({
            name,
            email,
            password,
            role
        }).then((data)=>{
            res.redirect('/login')
        }).catch((error)=>{
            console.log("=============CreateUser==============");
            console.log(error);
            console.log("=============CreateUser==============");
            res.redirect('/sign-up')
        })
}

//user login
exports.Userlogin = async (req,res)=>{
    try {
        const {email, password} = req.body
        if(!email){
            res.status(400).json({
                message: "Please Fill Your Email",
                status: "Error"
            })
        }
        const user = await UserClient.findOne({
            where:{
                email: email.toLowerCase()
            }
        })
        if(!user){
            res.status(404).json({
                message: "Email Not Found",
                status: "Error"
            })
        }
        if(password == user.password){
            let token = jwt.sign({
                user_id : user.uuid,
                name : user.name,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: 86400
            }
            )
            res.cookie('user_token', token, { maxAge: 86400000 })
            res.redirect('/')
        }else{
            res.status(400).json({
                message: "Invalid Password",
                status: "Error"
            })
        }

        
    } catch (error) {
        console.log(error)
    }
}

//edit user data
exports.editUser = async (req,res)=>{
    const {name, email, password, role} = req.body
    const {id} = req.params
    const oldUser = await UserClient.findOne({
        where:{
            uuid: id
        }
    })
    const updatedUser = await oldUser.update({
        name: name ?? oldUser.name,
        email: email ?? oldUser.email,
        password: password ?? oldUser.password,
        role: role ?? oldUser.role
    })
    res.redirect('/')
}