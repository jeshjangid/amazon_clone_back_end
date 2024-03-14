const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;



// middleware Setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// default Route
// Access: public
// Url: http://localhost:500/api/users/
router.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'User default route.'
    })
});



module.exports = router