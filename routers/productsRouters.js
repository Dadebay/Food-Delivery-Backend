const express = require('express')
const postgresClient = require('../config/db.js')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const text = 'SELECT * FROM products ORDER BY id ASC'
        const { rows } = await postgresClient.query(text)
        return res.status(200).json({ rows })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(500).json({ message: error.message })
    }
})
router.post('/create-product', async (req, res) => {
    try {
        const text =
            'INSERT INTO products (name, description, kargo_included, price, main_category_name, main_category_id, cafe_name, cafe_id, new_in_come, recomended, image, view_count, created_at, discount_value, images) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *'

        const values = [
            req.body.name,
            req.body.description,
            req.body.kargo_included,
            req.body.price,
            req.body.main_category_name,
            req.body.main_category_id,
            req.body.cafe_name,
            req.body.cafe_id,
            req.body.new_in_come,
            req.body.recomended,
            req.body.image,
            req.body.view_count,
            req.body.created_at,
            req.body.discount_value,
            req.body.images,
        ]
        const { rows } = await postgresClient.query(text, values)

        return res.status(201).json({ productCreated: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(500).json({ message: error.message })
    }
})

router.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params

        const text = 'SELECT * FROM products WHERE id = $1'

        const values = [productId]

        const { rows } = await postgresClient.query(text, values)

        if (!rows.length)
            return res.status(500).json({ message: 'Product not found' })

        return res.status(200).json({ product: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router
