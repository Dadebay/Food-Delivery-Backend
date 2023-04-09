const express = require('express')
const postgresClient = require('./config/db.js')
const userRouter = require('./routers/userRouters.js')
const productRouter = require('./routers/productsRouters.js')
const categoryRouter = require('./routers/categoryRouters.js')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const checkJwt = require('./helpers/jwt.js')
const errorHandler = require('./helpers/error_handler.js')

//App to start
const app = express()
app.use(express.json())

//Cors
app.use(cors())
app.options('*', cors())

// Api version variable
dotenv.config()
const api = process.env.API_URL

//Middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(checkJwt())
app.use(errorHandler)
// Routes
app.use(api + '/users', userRouter)
app.use(api + '/products', productRouter)
app.use(api + '/categories', categoryRouter)

// Create server with 4000 port
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    postgresClient.connect((err) => {
        if (err) {
            console.log(`connection error`, err.stack)
        } else {
            console.log(`db connection succefully`)
        }
    })
})
