const {User, User_History, Room} = require('../models')
const { Op } = require('sequelize')
const fs = require('fs')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register
exports.Register = async (req,res)=>{
    try {
        const {name, email, password, role} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name: name,
            email: email,
            role: role,
            password: hashedPassword
            
        })

        await User_History.create({
            user_uuid: newUser.uuid
        })

        res.json({
            message: "User Created SuccessFully"
        })
    } catch (error) {
        console.log('=============REGISTER==================');
        console.log(error);
        console.log('=============REGISTER==================');
        res.status(500).json({
            message: error.message,
            status: "Error"
         })
    }
}

//login 
exports.Login = async (req,res)=>{
    try {
        const {email, password} = req.body
        if(!email){
            res.status(400).json({
                message: "Please Fill Your Email",
                status: "Error"
             })
        }
        const user = await User.findOne({
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
        let passwordValidation = bcrypt.compareSync(password, user.password)
        if(!passwordValidation){
            res.status(400).json({
                message: "Incorrect Password",
                status: "Error"
             })
        }
        let token = jwt.sign(
            {
                user_id: user.uuid,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: 86400
            }
        )

        res.status(200).json({
            message: `You are logged in as ${user.name}`,
            role: user.role,
            token: token
        })
    } catch (error) {
        console.log('=============LOGIN==================');
        console.log(error);
        console.log('=============LOGIN==================');
        res.status(500).json({
            message: error.message,
            status: "Error"
         })
    }
}

//create room
exports.CrateRoom = async(req,res)=>{
    try {
    const roomName = req.body.roomName
    const user = req.user

    console.log(roomName)

    if(!roomName){
        res.status(400).json({
            message: "Please Fill Room Name",
            status: "Error"
         })
    }

    const newRoom = await Room.create({
        room_name: roomName,
        owned_by: user.user_id
    })

    res.status(201).json({
        status: "SUCCESS",
        message: "New Room Created",
        room_name: newRoom.room_name
      })
    } catch (error) {
        console.log('=============CREATEROOM==================');
        console.log(error);
        console.log('=============CREATEROOM==================');
        res.status(500).json({
            message: error.message,
            status: "Error"
         })
    }
}

//play game
exports.PlayGame = async (req,res) =>{
    try {
        const room_name = req.body.room_name
        const playerChoice = req.body.playerChoice
        
        if(!playerChoice){
            res.status(400).json({
                message: "No Choice Inputed",
                status: "Error"
             })
        }
        if(!Array.isArray(playerChoice)){
            res.status(400).json({
                message: "Input Data is Not Array",
                status: "Error"
             })
        }
        if(playerChoice.length != 3){
            res.status(400).json({
                message: "Inputed Data Must be 3 Choice",
                status: "Error"
             })
        }
        if(!room_name){
            res.status(400).json({
                message: "No Room Inputed",
                status: "Error"
             })
        }

        const foundRoom = await Room.findOne({
            where:{
                room_name: room_name
            }
        })

        if(!foundRoom){
            res.status(400).json({
                message: "No Room Founded",
                status: "Error"
             })
        }else{
            if(!foundRoom.player_1_uuid){
                await foundRoom.update({
                    player_1_choice: req.body.playerChoice,
                    player_1_uuid: req.user.user_id
                })
            }else if(!foundRoom.player_2_uuid){
                await foundRoom.update({
                    player_2_choice: req.body.playerChoice,
                    player_2_uuid: req.user.user_id
                })
            }else{
                res.status(400).json({
                    message: "Room Full",
                    status: "Error"
                 })
            }

            gameLogic(room_name, playerChoice)
            
            res.status(200).json({
                 message: "Your Choices Recorded, Wait For Player 2 To Choose"
            })
            

        }
    } catch (error) {
        console.log('================PLAYGAME===============');
        console.log(error);
        console.log('================PLAYGAME===============');
        res.status(500).json({
            message: error.message,
            status: "Error"
         })
    }
}

//game logic for PlayGame controller
const gameLogic = async (room_name, playerChoice)=> {
    const foundRoom = await Room.findOne({
        where:{
            room_name: room_name
        }
    })

    if(foundRoom.player_1_choice && foundRoom.player_2_choice){
        const user1History = await User_History.findOne({
            where:{
                user_uuid: foundRoom.player_1_uuid
            }
        })
        
        const user2History = await User_History.findOne({
            where:{
                user_uuid: foundRoom.player_2_uuid
            }
        })

        let player1Score = 0
        let player2score = 0

        for(const index in foundRoom.player_1_choice){
            const player1Choice = foundRoom.player_1_Choice[index]
            const player2Choice = foundRoom.player_2_Choice[index]

            const playersChoice = `${player1Choice}${player2Choice}`

            switch (playersChoice) {
                case "ROCKROCK":
                  player1Score += 1
                  player2Score += 1
                  break;
                case "ROCKPAPER":
                  player2Score += 1
                  break;
                case "ROCKSCISSOR":
                  player1Score += 1
                  break;
                case "PAPERROCK":
                  player1Score += 1
                  break;
                case "PAPERPAPER":
                  player1Score += 1
                  player2Score += 1
                  break;
                case "PAPERSCISSOR":
                  player2Score += 1
                  break;
                case "SCISSORROCK":
                  player2Score += 1
                  break;
                case "SCISSORPAPER":
                  player1Score += 1
                  break;
                case "SCISSORSCISSOR":
                  player1Score += 1
                  player2Score += 1
                  break;
                default:
                  break;
              }
        }

        if(player1Score > player2score){
            await user1History.update({
                win: Number(user1History.win) + 1
            })
            await user2History.update({
                lose: Number(user2History.lose) + 1
            })
            await foundRoom.update({
                winner_uuid : foundRoom.player_1_uuid,
                loser_uuid: foundRoom.player_2_uuid,
                draw: false
            })
            res.status(200).json({
                message: "PLAYER 1 WIN"
              })
        }else if(player1Score < player2score){
            await user1History.update({
                lose: Number(user2History.lose) + 1
            })
            await user2History.update({
                win: Number(user1History.win) + 1
            })
            await foundRoom.update({
                winner_uuid : foundRoom.player_2_uuid,
                loser_uuid: foundRoom.player_1_uuid,
                draw: false
            })
            res.status(200).json({
                message: "PLAYER 2 WIN"
              })
        }else{
            await user1History.update({
                draw: Number(user2History.draw) + 1
            })
            await user2History.update({
                draw: Number(user1History.draw) + 1
            })
            await foundRoom.update({
                draw: true
            })
            res.status(200).json({
                message: "DRAW"
              })
        }
    }
}