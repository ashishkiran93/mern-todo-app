 const express = require('express')
 const mongoose = require('mongoose')
 const todoModel = require("../models/todo")

 const router = express.Router()

// Enable JSON
 router.use(express.json())

//  GET request Routing
 router.get("/",async (req,res)=>{
    try {
        const allItems = await todoModel.find()
        res.status(200).send(allItems)
    } catch (error) {
        console.log(`Manual error from GET request ${error}`)
    }
 })

// POST request Routing
 router.post('/',async(req,res)=>{
    try {
        const newItem = new todoModel({
            name:req.body.name
        })
        console.log(newItem)
        const savedItem = await newItem.save()
        res.status(201).send(`Succesfully saved ${savedItem.name} in database`)
    } catch (error) {
        console.log(`Manual error from POST request ${error}`)
    }
 })

// DELETE request Routing
 router.delete('/:id' , async(req,res)=>{
   try {
    targetItem =  await todoModel.findById(req.params.id)
    statusFlag =  await targetItem.remove()
    if(statusFlag){
        res.status(200).send({success:true})
    }
   } catch (error) {
       console.log(`Manual error from DELETE request ${error}`)
   }
 })

// Module Export
 module.exports = router

