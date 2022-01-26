const express = require('express');
const morgan = require('morgan');
const app = express();
const PlantRoutes = require('./api/routes/Plant');
const userRoute = require('./api/routes/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require("helmet");


app.use(morgan('dev'));
app.use(bodyParser.json());// this will extract json data and make it easy readble for us
app.use(express.static('public'));
app.use(helmet()); //Helmet helps you secure your Express apps by setting various HTTP headers

//Database Connection
mongoose.connect('mongodb+srv://root:root@cluster0.1elqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',(err,done)=>{
    if(err) throw err
    if(done) return console.log('db connection is done')
});
mongoose.Promise = global.Promise;


/* 
- every request path starts with /palnts will be handled
- by a handler passed as a second parameter (PlantRoutes)
- so anything starting with /Plant in the url will be forwarded to /api/routes/Plant.js file
*/
app.use('/plants',PlantRoutes);
app.use('/users',userRoute);



app.listen(process.env.PORT || 3000,()=>{
    console.log('server connected')
})