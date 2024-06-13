//import express
const express = require('express')

const cors = require('cors')
const bodyparser = require('body-parser')

//import router
const router = require('./routes')

//init app
const app = express()

// use Corss
app.use(cors())

app.use(bodyparser.urlencoded({ extended:false }))
app.use(bodyparser.json())

//define port
const port = 3000;

app.use('/api', router);

//route
app.get('/', (req, res) => {
    res.send('Hello World');
})

//start server
app.listen(port, () => {
    console.log(`Server startedddd on port ${port}`);
})
