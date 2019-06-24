const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const port=4000;

app.use(cors());
app.use(bodyParser.json());


app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`);
    
})