const express = require('express')
const router = express.Router();

// @Route       GET api/auth
// @Desc        Get logged in user
// Acccess      Private
router.get('/', (req, res) => {
    res.send('Get Logged in User')
})

// @Route       POST api/auth
// @Desc        Auth user and get token
// Acccess      Public
router.post('/', (req, res) => {
    res.send('Login User')
})
module.exports = router