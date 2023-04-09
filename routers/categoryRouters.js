const express = require('express')
const postgresClient = require('../config/db.js')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const text = 'SELECT * FROM categories ORDER BY id ASC'
        const { rows } = await postgresClient.query(text)
        return res.status(200).json({ rows })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(500).json({ message: error.message })
    }
})
router.post('/createCategory', async (req, res) => {
    try {
        const text =
            'INSERT INTO categories (name,image,productcount) VALUES ($1, $2, $3) RETURNING *'

        const values = [req.body.name, req.body.image, req.body.productcount]
        const { rows } = await postgresClient.query(text, values)

        return res.status(201).json({ categoryCreated: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(500).json({ message: error.message })
    }
})

// router.get('/:productId', async (req, res) => {
//     try {
//         const { productId } = req.params

//         const text = 'SELECT * FROM products WHERE id = $1'

//         const values = [productId]

//         const { rows } = await postgresClient.query(text, values)

//         if (!rows.length)
//             return res.status(500).json({ message: 'Product not found' })

//         return res.status(200).json({ productId: rows[0] })
//     } catch (error) {
//         console.log('Error occured', error.message)
//         return res.status(500).json({ message: error.message })
//     }
// })

module.exports = router
