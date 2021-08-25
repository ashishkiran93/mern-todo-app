 const express  = require('express')
 const mongoose = require('mongoose')
 const dotenv   = require('dotenv')
 const Item     = require('./routes/api')

 const app = express()

 dotenv.config({path:"./config.env"})

//  Routing configuration
 app.use('/api/todo',Item)

//  database configuration
 const db = process.env.DB
 mongoose.connect(db, {
     useCreateIndex:true,
     useUnifiedTopology:true,
     useNewUrlParser:true,
     useFindAndModify:false
 }).then(()=>console.log("database connected successfully"))
   .catch(err=>console.log(`manual error from db ${err}`))

// Port Connection
 const port = process.env.PORT||5000

//  Production code
 if(process.env.NODE_ENV==="production"){
     app.use(express.static('client/build'))
     const path = require('path')
     app.get("*", (req,res)=>{
         res.sendFile(path.resolve(__dirname,"client", "build", "index.html"))
     })
 }

 app.listen(port,()=>{
     console.log(`Server started on port no ${port}`)
 })