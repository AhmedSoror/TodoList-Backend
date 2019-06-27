const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');
const config = require("./config/keys.js");

const app=express();
const port=4000;

app.use(cors());
app.use(bodyParser.json());
  
mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("We are connected to MongoDB"))
  .catch(err => console.log(err));

app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`);
    
})
