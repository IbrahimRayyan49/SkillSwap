require('dotenv').config();


const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');

const app=express();

//This is used to connect to the database
connectDB();

//Middlware
app.use(cors());
app.use(express.json());


app.use('/',(req,res)=>{
    res.json({message:'SkillSwap API is up and running'});
})

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})