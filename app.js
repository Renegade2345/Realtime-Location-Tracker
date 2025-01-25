const express = require('express')
const app = express();
// because Socket.io runs on http server
const http = require('http')

// creating http server, its a built in package and below mentioned method is one of the widely used method
const server = http.createServer(app)

const socket = require("socket.io")


const io = socket(server);
const path = require('path')



app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

io.on("connection", function(socket){
    socket.on("send-location", function(data){
        io.emit("recieve-location",{id:socket.id, ...data})
    })

    socket.on("disconnnect", function(){
        io.emit("user-disconnected", socket.id)
    })
})

app.get('/', (req,res)=>{
    res.render("index")
})


server.listen(3000)
