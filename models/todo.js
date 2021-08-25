 const mongoose = require('mongoose')

 const Schema = mongoose.Schema

//  Schema declaration
 const itemSchema = new Schema({
     name:{
         type:String,
         required:true
     },
     date:{
         type:Date,
         default:Date.now
     }
 })

//  Model Declaraction
 const Item = mongoose.model("useritem",itemSchema)

// Module Export
 module.exports = Item