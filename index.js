const express = require('express')
var cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())




app.get('/', (req, res) => {
  res.send('Puzzle Server Running ...')
})

app.listen(port, () => {
  console.log(`Puzzle Server Running on port ${port}`)
})