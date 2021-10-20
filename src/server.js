const express = require("express")
require("dotenv").config()
const bodyParser = require('body-parser')
const fs = require("fs")
const axios = require('axios')

const path = require('path')
const app = express()
const publicPath = path.join(__dirname, '../public')
console.log(publicPath)
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

var states = new Map()


app.get('/', async(req, res)=>{
    fs.readFile('commodities.json', (err, data) => {
        if(err){
            res.send("an error occured")
        }
        let commodities = JSON.parse(data)
        for(let index in commodities){
            let state = commodities[index].state
            let district = commodities[index].apmc
            let commodity = commodities[index].commodity
            // console.log(commodities[index].apmc)
            if(!states.has(state)){
                states.set(state, new Map())
            }
            if(states.has(state) && !states.get(state).has(district)){
                states.get(state).set(district, new Map())
            }
            if(states.has(state) && states.get(state).has(district)){
                //  method to implement this 
                states.has(state) && states.get(state).get(district).set(commodity, [])
                let costArray = states.has(state) && states.get(state).get(district).get(commodity)
                costArray.push(commodities[index].min_price)
                costArray.push(commodities[index].modal_price)
                costArray.push(commodities[index].max_price)
            }
            
        }
        res.render('home', {data: commodities})
        // console.log(states)
    })
    // async/await is required here line 38 is running before line 35
    // console.log("sending the response")
})

app.listen(process.env.PORT, ()=>{
    console.log(`server is starting at ${process.env.PORT}`)
})