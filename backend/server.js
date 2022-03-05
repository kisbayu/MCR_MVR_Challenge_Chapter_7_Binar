//import modules
require('dotenv').config()
const express = require('express')
const res = require('express/lib/response')
const db = require('./models')
//const router = require('./routes/routes.js')
const app = express()

//use json to get data
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//call routes
//app.use(router)

//connect to db & localhost
const PORT = process.env.PORT || 4000
db.sequelize.sync({
    
}).then(()=>{
    console.log("Database Connected");
    app.get('/', (req, res) => {
        res.send('Hello World!')
      })
    app.listen(PORT, ()=>{
        console.log(`Server is Listening to http://localhost${PORT}`);
    })
}).catch((error)=>{
    console.log(error);
})