const express = require('express');
const app = express();
const PORT = 7000;
const path = require('path');

const http = require('http');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(httpServer);

app.set('view engine','ejs');
app.use(express.static(path.resolve('./public')));

io.on('connection',function(socket){


    socket.on('send-location',function(data){

        io.emit('receive-location',{id:socket.id, ...data});

    });

    socket.on('disconnect',function(){
        io.emit('user-disconnected',socket.id);
    });

});



app.get('/',(req,res)=>{
    res.render("index.ejs");
});

httpServer.listen(PORT,()=>{
    console.log("Server Started");
});
