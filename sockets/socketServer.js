const ws = require('ws');
const { parseIfValifJSON } = require('../controllers/logic');

const wss = new ws.Server({
    noServer: true
}, () => {
    console.log('Web Socket running on port',port);
});


wss.on('connection',  wsc => {
    
    wsc.send(JSON.stringify({message:'Hello from the server'}));    

    wsc.on('message', data => {
        
        const incomingObj = parseIfValifJSON(data);


        if(incomingObj.roomId) {
            wsc.roomId = incomingObj.roomId;
            wsc.send(JSON.stringify({ roomId:incomingObj.roomId }));
        }


        if(incomingObj.userName) {
            wsc.userName = incomingObj.userName;

            //Sending all the users notification whenever a new user joins a room
            wss.clients.forEach(client => {
                if(client.readyState === ws.OPEN && client != wsc && client.roomId === wsc.roomId)
                client.send( JSON.stringify({ notification: `${wsc.userName} joined the chat` }) );
            });

        }


        if(incomingObj.message){

            wss.clients.forEach(client => {
                if(client.readyState === ws.OPEN && client.roomId === wsc.roomId && client != wsc)
                client.send( JSON.stringify({ userName: wsc.userName, message: incomingObj.message }) );
            });
            wsc.send(JSON.stringify({ recieved: incomingObj.msgId }));

        }

        //Sending onlineuser's name every 1 sec 
        setInterval(() => {
           let onlineUsers = [];
           wss.clients.forEach(client => {
            if( client.readyState === ws.OPEN && client.roomId === wsc.roomId )
                onlineUsers.push(client.userName);
            });
            wsc.send(JSON.stringify({ onlineUsers }));
        },1000);


    });
} );

module.exports = { wss };