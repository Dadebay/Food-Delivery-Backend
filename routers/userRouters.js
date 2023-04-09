const express = require('express')
const jwt = require('jsonwebtoken')
const postgresClient = require('../config/db.js')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const text =
            'INSERT INTO users (phone, fullname, otp) VALUES ($1, $2 ,$3) RETURNING *'

        const values = [req.body.phone, req.body.fullname, req.body.otp]

        const { rows } = await postgresClient.query(text, values)

        return res.status(201).json({ createdUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })
    }
})
router.get('/', async (req, res) => {
    try {
        const text = 'SELECT * FROM users ORDER BY id ASC'

        // const values = [req.body.phone, req.body.fullname, req.body.otp]

        const { rows } = await postgresClient.query(text)

        return res.status(200).json({ users: rows })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })
    }
})

//Authenicate user
router.post('/login', async (req, res) => {
    try {
        const text = 'SELECT * FROM users WHERE phone = $1 AND otp = $2'
        const secret = process.env.JWT_SECRET
        const values = [req.body.phone, req.body.otp]

        const { rows } = await postgresClient.query(text, values)

        if (!rows.length)
            return res.status(404).json({ message: 'User not found' })

        const token = jwt.sign(
            {
                userID: rows[0].id,
                isAdmin: rows[0].isAdmin,
            },
            secret,
            { expiresIn: '365d' }
        )
        return res.status(200).json({
            user: rows[0].phone,
            token,
            message: 'Succefully logged in',
        })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })
    }
})

// Update user data
router.post('/update/:userID', async (req, res) => {
    try {
        const { userID } = req.params

        const text = 'UPDATE users SET fullname = $1 WHERE id = $2 RETURNING *'

        const values = [req.body.fullname, userID]

        const { rows } = await postgresClient.query(text, values)

        if (!rows.length)
            return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({ updatedUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })
    }
})

// Delete user
router.post('/delete/:userID', async (req, res) => {
    try {
        const { userID } = req.params

        const text = 'DELETE FROM users WHERE id = $1 RETURNING *'

        const values = [userID]

        const { rows } = await postgresClient.query(text, values)

        if (!rows.length)
            return res.status(404).json({ message: 'User not found' })

        return res.status(200).json({ deletedUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })
    }
})

module.exports = router
