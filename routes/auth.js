const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult }= require('express-validator/check')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// @Route       GET api/auth
// @Desc        Get logged in user 
// Acccess      Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})


// @Route       POST api/auth
// @Desc        Auth user and get token
// Acccess      Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }

    const { email, password } = req.body
    try {  
        let user = await User.findOne({ email }) 
        
        if(!user)
            return res.status(400).json( { msg: 'Invalid Credentials'})

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.status(400).json( { msg: 'Invalid Credentials'})

        const payload = {
            user : {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),{
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err
            res.json({ token })
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})

module.exports = router