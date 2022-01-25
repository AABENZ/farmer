const mongoose = require('mongoose')

const plantSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: {type:String,required:true},
    p_type: {type:String,required:true},
    Spacing:{type:String,required:true},
    Height: {type:String,required:true},
    Sun_Exposure:{type:String,required:true},
    Water_Requirements:{type:String,required:true},
    Temperature:{type:String,required:true},
    Soil_Type:{type:String,required:true},
    Soil_pH:{type:String,required:true},
    Fertilizer:{type:String,required:true},
    Harvesting:{type:String,required:true},
    How_To_Plant:{},
    Diseases_Solution:{},
    plantImage: {type:String},
    cloudinary_id: {type:String}
})

module.exports = mongoose.model('PlantSchema', plantSchema)