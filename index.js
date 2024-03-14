// library include
require('dotenv').config();


const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const database = require('./database');


const port = process.env.PORT;


// user routes
const userRoutes = require('./routes/users');


// middleware
app.use(cors());
app.use(morgan('dev'));
app.use('/api/users', userRoutes);


//route
app.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'Amazon Clone REST API Home Page'
    })
})


// Start Server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})