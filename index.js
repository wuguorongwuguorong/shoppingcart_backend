const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool =require('./database');// 



const app = express();

app.use(express.json)
app.use(cors());

app.get('/', (req,res) => {
    res.json({message: "Welcome to the Api "})
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`);
})