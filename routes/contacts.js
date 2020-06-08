const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { check, validationResult }= require('express-validator/check')
const auth = require('../middleware/auth')
const Contact = require('../models/Contact')


// @Route       GET api/contacts
// @Desc        Get all users contacts
// Acccess      Private
router.get('/', auth, async (req, res) => {
    try {
        const contact = await Contact.find({ user: req.user.id}).sort({ date: -1})
        res.json(contact)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

// @Route       POST api/contacts
// @Desc        Add new contact
// Acccess      Private
router.post('/', [ auth, [
    check('name', 'Name is required').not().isEmpty()
] ], async (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }

    const { name, email, phone, type }= req.body

    try {
        const newContact = new Contact({
            name,
            email,
            phone, 
            type, 
            user: req.user.id
        })

        const contact = await newContact.save()

        res.json(contact)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Serevr Error')
    }
})

// @Route       PUT api/contactd/:id
// @Desc        Update contact
// Acccess      Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, type }= req.body

    //  Build contact body
    const contactFields = {}
    if(name) contactFields.name = name
    if(email) contactFields.email = email
    if(phone) contactFields.phone = phone
    if(type) contactFields.type = type

    try {
        let contact = await Contact.findById(req.params.id)
        if(!contact) 
            return res.status(404).json({ msg: 'Contact not found'})

        // Make sure user owns contact
        if(contact.user.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized'})

        contact = await Contact.findByIdAndUpdate(req.params.id, 
            {
                $set: contactFields
            },{
                new: true
            })
        res.json(contact)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

})

// @Route       DELETE api/contacts/:id
// @Desc        Delete contact
// Acccess      Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id)
        if(!contact) 
            return res.status(404).json({ msg: 'Contact not found'})

        // Make sure user owns contact
        if(contact.user.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized'})

        await Contact.findByIdAndRemove(req.params.id)
        res.json({ msg: 'Contact Removed'})
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
module.exports = router