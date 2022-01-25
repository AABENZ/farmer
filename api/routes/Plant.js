const express = require('express');
const router = express.Router();
const Plant = require('../models/plant');
const mongoose = require('mongoose');
const cloudinary = require('../../utils/cloudinary');
const multer = require('../../utils/multer'); 
const checkAuth = require('../middleware/check-auth');
const dotenv = require('dotenv').config({path:__dirname+'./../../.env'});

router.post("/" ,multer.single("PlantImage") ,  async (req, res) => {
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
      console.log(err);
    }
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


//test
router.get('/test', (req, res,next) => {
    res.json({message:'hello from pc'})
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

//find all plants by category
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
router.patch('/:plantId', (req, res,next) => {
    const id = req.params.plantId;
    Plant.findByIdAndUpdate(id,{Spacing:req.body.Spacing},{new: true}).exec()
    .then(result => {res.status(200).json({message:"Plant updated Successfully"})})
    .catch(err => res.send(500).json({error:err}))

});

//delete plant
router.delete('/:plantId', async (req, res,next) => {
try{
    const id = req.params.plantId;
    const plant = await Plant.findById(id);
    //delete image from cloudinary
    cloudinary.uploader.destroy(plant.cloudinary_id);
    await plant.remove();
    res.status(200).json({message:"Plant Deleted Successfully"})
}catch(err){
    res.status(500).json({error:err})
}
});
module.exports = router;