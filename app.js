const express = require('express');
const app = express();
const ws = require('ws');
const path = require('path');
const router = require('./routes/handleRoutes');
 
const { wss } = require('./sockets/socketServer');

app.use('/', express.static(path.resolve(__dirname,'./public')));
app.use('/', router);


const port = process.env.PORT||8080; 

const server = app.listen(port,() => {
    console.log('Express app running on port',port);
});


server.on('upgrade', async function upgrade(request, socket, head) {
    
    // if(user is un-authorized) {
    // socket.destroy();
    // return socket.end('HTTP/1.1 401 Unauthorized\r\n', 'ascii');
    // }

    let args = [];
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, ...args);
    });
});
