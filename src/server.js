const express = require("express")
require("dotenv").config()

const path = require('path')
const app = express()
const publicPath = path.join(__dirname, '../public')
console.log(publicPath)
app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.render('home')
})

app.listen(process.env.PORT, ()=>{
    console.log(`server is starting at ${process.env.PORT}`)
})