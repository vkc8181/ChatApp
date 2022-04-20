const express = require('express');
const app = express();
const ws = require('ws');
const path = require('path');
const { info } = require('console');

app.use('/', express.static(path.resolve(__dirname,'./views')));

app.get('/',(req,res) => {
	res.render('home.ejs');
})

app.get('/room/:roomid',(req,res) => {
    const roomid = req.params.roomid;
    if(roomid.length != 4)
    res.send('Not a valid room');

    console.log('roomid='+roomid);
    res.locals.roomid = roomid;
    res.render('home.ejs');
});

const port = process.env.PORT||8080; 

const server = app.listen(port,() => {
    console.log('Express app running on port',port);
});

const parseIfValifJSON = str => {
    try{
        if(isNaN(str))
        return JSON.parse(str);
    }
    catch (e) { }
    return false;
};


const wss = new ws.Server({
    // port: 1234
    // server,
    // verifyClient(info) {
    //     console.log(info);
    //     return false;
    // }
    noServer: true
}, () => {
    console.log('Web Socket running on port',port);
});

server.on('upgrade', async function upgrade(request, socket, head) {
   
    // socket.destroy();
    // return socket.end('HTTP/1.1 401 Unauthorized\r\n', 'ascii');
    let args = [];
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, ...args);
    });
  });



wss.on('connection', wsc => {
    
    console.log('Connection made');
    wsc.send('Hello from the server');
    wsc.on('message', data => {
        console.log('Incoming msg: ',data);
        const incomingObj = parseIfValifJSON(data);
        if(incomingObj) {
            wsc.roomId = incomingObj.roomId;
            console.log('roomid assigned: ',incomingObj.roomId);
        }
        wss.clients.forEach(client => {
            if(client.readyState === ws.OPEN && client != wsc && client.roomId === wsc.roomId && incomingObj===false)
            client.send(data);
            // console.log('vkc=',client);
        });
        // wsc.send(data);
    });
});

console.log('App running');