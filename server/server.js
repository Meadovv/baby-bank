const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const connectDB = require('./configs/database')

// environment variable
dotenv.config()

// mongo database
connectDB();

// rest object
const app = express()

// middleware
app.use(express.json({limit: '50mb'}))
app.use(morgan('dev'))

//routes
app.use('/api/v1/authentication', require('./routes/authRoutes'))
app.use('/api/v1/post', require('./routes/postRoutes'))
app.use('/api/v1/request', require('./routes/requestRoutes'))
app.use('/api/v1/storage', require('./routes/storageRoutes'))
app.use('/api/v1/chat', require('./routes/chatRoutes'))

app.use('/api/v1/function', require('./routes/publicRoutes'))

app.get('/', (req, res) => {
    res.status(200).send({
        message: "server running",
    });
});

app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log(`>>> Log: Server is running in ${process.env.NODE_MODE} Mode on PORT: ${process.env.SERVER_PORT}`);
})