const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const {userJoin, getCurrentUser , leftUser , getRoomUsers} = require('./utils/users.js');

const server = http.createServer(app);
const io = socketio(server);
const botName = 'Chatbot App';

app.use(express.static(path.join(__dirname,'public')));

io.on('connection',(socket)=>{

    socket.on('joinRoom', ({username, room})=> {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        
        socket.emit('message', formatMessage(botName,'Welcome to chat bot')); //welcome new user
        socket.broadcast.to(user.room).emit('message',
            formatMessage(botName, `${user.username} has joined`)); //broadcast to all other user about new user connection
       io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
       });
            socket.on('chatMessage' , (msg)=> {
                io.emit('message', formatMessage( `${user.username}`, msg));
            }); // listen for chat messages 
        
        socket.on('disconnect', ()=>{
            const user = leftUser(socket.id);
            if(user){
                io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left ${user.room}`));
                }
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                   });
            }); //when user leaves
        });
    });

    
const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=>{
    console.log(`Listening at ${PORT}`);
});