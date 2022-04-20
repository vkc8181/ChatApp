const express = require('express');
const app = express();
const ws = require('ws');
const path = require('path');

app.use('/', express.static(path.resolve(__dirname,'./views')));

app.get('/',(req,res) => {
	res.render('home.ejs');
})

const port = process.env.port||8080; 

const server = app.listen(port,() => {
    console.log('Express app running on port',port);
});


const wss = new ws.Server({
    // port: 1234
    server
}, () => {
    console.log('Web Socket running on port',port);
});

const clients = [];

wss.on('connection', wsc => {
    clients.push(wsc);
    console.log('Connection made');
    wsc.send('Hello from the server');
    wsc.on('message', data => {
        console.log('Incoming msg: ',data);
        clients.forEach(client => {
            if(client != wsc)
            client.send(data);
        });
        // wsc.send(data);
    });
});

console.log('App running');