const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { check, validationResult }= require('express-validator/check')
const config = require('config')
const jwt = require('jsonwebtoken')

// @Route       POST api/users
// @Desc        Register a user
// Acccess      Public
router.post('/', [
    check('name', 'Please enter name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a passwork with 6 or more characters').isLength({ min: 6})
], 
async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email }) 
        if(user)
            return res.status(400).json({ msg: 'User already exist'})
        user = new User({
            name,
            email,
            password
        })  

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

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