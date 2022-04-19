const ws = require('ws');

const wss = new ws.Server({
    port: 1234
}, () => {
    console.log('Server running on port 1234');
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