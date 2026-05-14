require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });


const express=require('express');
const cors=require('cors');
const connectDB=require('./config/db');

const app=express();

//This is used to connect to the database
connectDB();

//Middlware
app.use(cors());
app.use(express.json());


app.get('/',(req,res)=>{
    res.json({message:'SkillSwap API is up and running'});
})

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


app.use('/api/reviews', reviewRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})