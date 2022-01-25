const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');






router.post('/signup',(req,res,next)=>{
    //check if email exist before signup
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        // result of user is an array so we have to check the length to make sure that it does not contain any user
        if(user.length >= 1){ 
            //status 209 means conflict
            return res.status(209).json({error:'user already registred'})
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({error:err});
                }else{
    
                    const user = new User({
                        _id : mongoose.Types.ObjectId(),
                        name:req.body.name,
                        email:req.body.email,
                        password:hash
                    });
                    user.save()
                    .then(result => {
                        res.status(201).json({
                            message:'user created'
                        })
                    })
                    .catch(err => {
                       res.status(500).json({
                        error:err
                       })
                    })
                }
            })
        }
    })
});

//signin user
router.post('/login',(req,res,next) => {
    User.find({email:req.body.email}).exec()
    .then(users => {
        if(users.length < 1){
            return res.status(401).json({message:"auth failed"})
        }
        bcrypt.compare(req.body.password,users[0].password,(err,result) => {
            if(err){
                return res.status(401).json({message:"auth failed"})
            }
            if(result){
                const token = jwt.sign(
                    { 
                        email: users[0].email,
                        _id: users[0]._id
                    }, 
                    'secret',
                    {
                        expiresIn:'1h'
                    }
                    );
                return res.status(200).json({message:"auth successful",token:token})
            }
            res.status(401).json({message:"auth failed"})
        })
    })
    .catch(err => res.send(500).json({error:err}))
})



router.delete("/delete/:userid", (req, res,next) => {
    const id = req.params.userid;
    User.findByIdAndDelete(id).exec()
    .then(result => {res.status(200).json({message:"User Deleted Successfully"})})
    .catch(err => res.send(500).json({error:err}))
});








module.exports = router;