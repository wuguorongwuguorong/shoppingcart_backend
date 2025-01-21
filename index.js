const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool =require('./database');

const app = express();
// const router = express.Router();
const productsRouter = require('./routes/products');
const userRouter = require('./routes/users');



app.use(express.json())
app.use(cors());



app.get('/', async (req,res) => {

    const [products] = await pool.query("SELECT * FROM products");

    res.json({
        message: "Welcome to the Api ",
        products
    })
});


//calling the routes for all options
app.use('/api/products', productsRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`);
})