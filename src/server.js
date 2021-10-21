const express = require("express")
require("dotenv").config()
const bodyParser = require('body-parser')
const fs = require("fs")
const axios = require('axios')

const path = require('path')
const app = express()
const publicPath = path.join(__dirname, '../public')
console.log(publicPath)
app.use(express.static(publicPath))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))

var states = new Map();
var ans = {};

app.get('/', async(req, res)=>{
    fs.readFile('commodities.json',(err, data) => {
        if(err){
            res.send("an error occured")
        }
        let commodities = JSON.parse(data)
        // console.log(commodities)
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

        states.forEach((districts,state_name)=>{
            ans[state_name] = {};
            districts.forEach((commodities1,district_name)=>{
                ans[state_name][district_name] = {};
                commodities1.forEach((list,commodity_name)=>{
                    ans[state_name][district_name][commodity_name] = list;
                })                 
            })
        })
        // return states
        // console.log([...states])
        res.render('home', {data:JSON.stringify(ans)})
    })
})


app.post('/', (req, res)=>{
    const state = req.body.state
    const district = req.body.district
    const commodity = req.body.commodity
    
    let array = [];

    if(states.has(state)){
        if(states.has(state).has(district)){
            if(states.has(state).has(district).has(commodity)){
               array.push(states.has(state).has(district).has(commodity));
            }
        }else{
            states.has(state).forEach((values,keys)=>{
                if( values.has(commodity)){
                   array.push(values.has(commodity)); 
                }
            })
        }
    }else{

    }

    console.log(array);
    return res.json({"success":true});

})

app.listen(process.env.PORT, ()=>{
    console.log(`server is starting at ${process.env.PORT}`)
})