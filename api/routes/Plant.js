const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');
const mongoose = require('mongoose');
const cloudinary = require('../../utils/cloudinary');
const multer = require('../../utils/multer'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({path:__dirname+'./../../.env'});


//ADD new PLant
router.post("/",multer.single("PlantImage"),verifyToken, async (req, res) => {
    jwt.verify(req.token,"secret", async (err,data)=>{
        if(err){
            res.sendStatus(403).json({message:'access forbidden'})
        }else{
            try {
                // Upload image to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path);
            
                // Create new plant
                const plant = new Plant({
                    _id : mongoose.Types.ObjectId(),
                    name: req.body.name,
                    p_type:req.body.p_type,
                    Spacing:req.body.Spacing,
                    Height:req.body.Height,
                    Sun_Exposure:req.body.Sun_Exposure,
                    Water_Requirements:req.body.Water_Requirements,
                    Temperature:req.body.Temperature,
                    Soil_Type:req.body.Soil_Type,
                    Soil_pH:req.body.Soil_pH,
                    Fertilizer:req.body.Fertilizer,
                    Harvesting:req.body.Harvesting,
                    How_To_Plant:req.body.How_To_Plant,
                    Diseases_Solution:req.body.Diseases_Solution,
                    plantImage:result.secure_url,
                    cloudinary_id:result.public_id
                });
                // Save user
               await plant.save();
                res.status(200).json(plant);
              } catch (err) {
                res.status(500).json({error:err})
              }
          
        }
    })
  });

//get all plants : localhost:3000/plants
router.get('/', (req, res,next) => {
    Plant.find()
    .exec()
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        error:err
    })
});

//find plant by id
// get plant by id : localhost:3000/plants/61ed37f2c9d58af8c340ee4c
router.get('/:plantId', (req, res,next) => {
    //extract plantId
    const _id = req.params.plantId;
    Plant.findById(_id)
    //select the fields you wan to get in your response
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({plant:doc});
        }else{
            res.status(404).json({message:"no valid plant found for provided id"});
        }
    })
    .catch(err => res.status(500).json({error:err}))
});



//update name
router.patch('/:plantId', verifyToken, async (req, res,next) => {
    jwt.verify(req.token,"secret", async (err,data)=>{
        if(err){
            res.sendStatus(403).json({message:'access forbidden'})
        }else{
            try{
                const id = req.params.plantId;
                const plant = await Plant.findById(id);
                Plant.findByIdAndUpdate(id,{name:req.body.name},{new: true}).exec()
                .then(result => {res.status(200).json({message:"Plant updated Successfully"})})
                .catch(err => res.send(500).json({error:err}))
            }catch(err){
                res.status(500).json({error:err})
            }
        }
    })

});

//delete plant
router.delete('/:plantId',verifyToken, async (req, res,next) => {
    jwt.verify(req.token,"secret", async (err,data)=>{
        if(err){
            res.sendStatus(403).json({message:'access forbidden'})
        }else{
            try{
                const id = req.params.plantId;
                const plant = await Plant.findById(id);
                //delete image from cloudinary
                cloudinary.uploader.destroy(plant.cloudinary_id);
                //delete plant from db
                await plant.remove();
                res.status(200).json({message:"Plant Deleted Successfully"})
            }catch(err){
                res.status(500).json({error:err})
            }
        }
    })


});

//token verification function
function verifyToken(req,res,next){
    const BearerHeader = req.get('Authorization');
    const token = BearerHeader.split(" ")[1];
    req.token = token;
    next();
}

module.exports = router;