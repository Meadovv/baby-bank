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
app.use(express.json({limit: '5mb'}))
app.use(morgan('dev'))

//routes
app.use('/api/v1/authentication', require('./routes/authRoutes'))
app.use('/api/v1/geometry', require('./routes/geoRoutes'))
app.use('/api/v1/post', require('./routes/postRoutes'))
app.use('/api/v1/request', require('./routes/requestRoute'))
app.use('/api/v1/appointment', require('./routes/appointmentRoute'))
app.use('/api/v1/notification', require('./routes/notificationRoute'))
app.use('/api/v1/storage', require('./routes/storageRoute'))

app.use('/api/v1/function', require('./routes/reportRoutes'))
app.use('/api/v1/function', require('./routes/publicRoute'))
app.use('/api/v1/function', require('./routes/listRoute'))
app.use('/api/v1/function/assistant', require('./routes/assistantRoute'))

app.get('/', (req, res) => {
    res.status(200).send({
        message: "server running",
    });
});

app.get('/get-answer', async (req, res) => {

})

app.listen(process.env.SERVER_PORT, (req, res) => {
    console.log(`>>> Log: Server is running in ${process.env.NODE_MODE} Mode on PORT: ${process.env.SERVER_PORT}`);
})