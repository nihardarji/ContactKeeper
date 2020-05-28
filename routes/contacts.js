const express = require('express')
const router = express.Router();

// @Route       GET api/contacts
// @Desc        Get all users contacts
// Acccess      Private
router.get('/', (req, res) => {
    res.send('Get all contacts')
})

// @Route       POST api/contacts
// @Desc        Add new contact
// Acccess      Private
router.post('/', (req, res) => {
    res.send('Add contact')
})

// @Route       PUT api/contactd/:id
// @Desc        Update contact
// Acccess      Private
router.put('/:id', (req, res) => {
    res.send('Update contact')
})

// @Route       DELETE api/contacts/:id
// @Desc        Delete contact
// Acccess      Private
router.delete('/:id', (req, res) => {
    res.send('Delete contact')
})
module.exports = router