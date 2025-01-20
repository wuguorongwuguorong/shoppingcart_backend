const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool =require('./database');
const router = express.Router();
const productsRouter = require('./routes/products');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json)
app.use(cors());

//calling the routes for all options
app.use('/api/products', productsRouter);
app.use('/api/users', userRoutes);

app.get('/', (req,res) => {
    res.json({message: "Welcome to the Api "})
});

router.get('/', (req, res) => {
    res.json({ message: "Get all products" });
  });

module.exports = router;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`);
})