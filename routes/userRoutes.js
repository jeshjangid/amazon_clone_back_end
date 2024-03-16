const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const User = require('./../models/User');
const token_key = process.env.TOKEN_KEY;

const verifyToken = require('./../middleware/verify_token');


const storage = require('./storage')


// middleware Setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// default Route
// Access: public
// Url: http://localhost:500/api/users/
// method: GET
router.get('/', (req, res) => {
    return res.status(200).json({
        status: true,
        message: 'User default route.'
    })
});




// user register route
// Access: public
// url: http://localhost:500/api/users/register
// method: POST

router.post('/register', [
    // check empty fields
    check('username').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    
    // check email 
    check('email').isEmail().normalizeEmail(),
    
], (req, res) => {
    const errors = validationResult(req);

    // check errors is not empty
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: false,
            errors: errors.array(),
            message: "Form validation error..."
        })
    }

    // Check email already exists or not
    User.findOne({ email: req.body.email }).then(user => {
        // check email exists or not
        if(user){
            return res.status(409).json({
                status: false,
                message: 'User Email already exists'
            })
        }else{

            // hashing password
            const salt = bcrypt.genSaltSync(10)
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // Create user object from user modal
            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedPassword,
            })

            // Insert new User
            newUser.save().then(result => {
                return res.status(200).json({
                    status: true,
                    user: result
                })
            }).catch(error => {
                return res.status(502).json({
                    status: false,
                    error: error
                })
            })
        }
    }).catch(error => {
        return res.status(502).json({
            status: false,
            error: error
        })
    })
})

// User profile pic upload Route
// Access: public
// Url: http://localhost:500/api/users/uploadProfilePic
// method: POST
router.post('/uploadProfilePic', (req, res) => {
    let upload = storage.getProfilePicUpload();

    upload(req, res, (error) => {
        console.log(req.file);

        if(error){
            return res.status(400).json({
                status: false,
                error: error,
                message: 'File upload failed...'
            })
        }else{

        return res.status(200).json({
            status: true,
            message: 'File upload success'
        })
    }
    })
})


// User login Route
// Access: public
// Url: http://localhost:500/api/users/login
// method: POST
router.post('/login', [
    // check empty fields
    check('password').not().isEmpty().trim().escape(),
    
    // check email 
    check('email').isEmail().normalizeEmail(),
    
], (req, res) => {
    const errors = validationResult(req);

    // check errors is not empty
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: false,
            errors: errors.array(),
            message: "Form validation error..."
        })
    }

    User.findOne({email: req.body.email}).then(user => {
        // if user don't exists
        if(!user){
            return res.status(404).json({
                status: false,
                message: "User don't exists",
            })
        }else{
            // match user password
            let isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);

            // check is not password match
            if(!isPasswordMatch){
                return res.status(401).json({
                    status: false,
                    message: "Password don't match ...",
                })
            }

            // JSON Web Token Generate
            let token = jwt.sign({
                id: user._id,
                email: user.email
            },
            token_key,
            {
                expiresIn: 3600
            }
            );

            // if login success
            return res.status(200).json({
                status: true,
                message: 'User login successfully',
                token: token,
                user: user
            })
        }
    }).catch(error => {
        return res.status(502).json({
            status: false,
            message: "Database error...",
        })
    })
    
})



// router.get('/testJWT', verifyToken, [], (req, res) => {
//     console.log(req.user);
//     return res.status(200).json({
//         status: true,
//         message: "JSON Web Token Working...",
//     })
// })


module.exports = router