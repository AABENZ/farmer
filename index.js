const express = require('express');
const morgan = require('morgan');
const app = express();
const PlantRoutes = require('./api/routes/Plant');
const userRoute = require('./api/routes/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path:__dirname+'/.env'});

app.use(morgan('dev'));
// this will extract json data and make it easy readble for us
app.use(bodyParser.json());
mongoose.connect('mongodb+srv://root:root@cluster0.1elqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',(err,done)=>{
    if(err) throw err
    if(done) return console.log('connection is done')
    
});
mongoose.Promise = global.Promise;


/* 
- every request path starts with /transactions will be handled
- by a handler passed as a second parameter (transactionRoutes)
- so anything starting with /transactions in the url will be forwarded to /api/routes/transactions file
*/
app.use('/plants',PlantRoutes);
app.use('/users',userRoute);


//connect to database






//
app.use((req,res,next)=>{
    const error = new Error('NOT FOUND');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    })
});

app.listen(process.env.PORT,()=>{
    console.log("running")
})