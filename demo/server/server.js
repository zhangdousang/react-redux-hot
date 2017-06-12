"use strict"

let express = require("express");
let bodyParser = require("body-parser");
let path = require("path");
let url = require("url");
let app = express();
require('./webpackdev.server')(app);
app.use(express.static('demo/wwwroot'));
app.use(bodyParser.json());

app.get("/Index*",function(req,res){
  res,sendFile(path.resolve(__dirname,"../wwwroot/index.html"));
});
//模拟数据
var database=[{name:"hello feakData"}];
//模拟接口
app.get("/find",function(req,res){
    res.send(database)
})

app.post("/add",function(req,res){
    database.push(req.body);
    res.send('suc');
})

app.post("/del",function(req,res){
    database.map((val,index)=>{
        if(val.name==req.body.name) database.splice(index,1)
    })
    res.send('suc')
})
app.post("/updated",function(req,res){
    database.map((val,index)=>{
        if(val.name==req.body.name) database[index]=req.body
    })
    res.send('suc')
})

let server = app.listen(8000, function () {
    let host = server.address().address;
    let port = server.address().port;
    console.log("服务已启动，http://%s:%s", "127.0.0.1", port);
})
