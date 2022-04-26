console.log('script.js included');

const currURL = document.URL;
const roomId = parseInt(currURL.slice(-4));

console.log('roomiD: '+roomId);



const roomName = document.querySelector('.container .roomInfo .roomName');
const onlineCountDiv = document.querySelector('.container .roomInfo .onlineCountDiv');
const onlineUsersDiv = document.querySelector('.container .roomInfo .onlineUsers');

const messageBox = document.querySelector('#messageBox');
const input = document.querySelector('#input');
const button = document.querySelector('button');
const form = document.querySelector('form');
const audio = new Audio('/ting.mp3');

const userName = prompt('Enter your name');
// const userName = 'vkc';


button.disabled = true;

const parseIfValifJSON = str => {
    try{
        if(isNaN(str))
        return JSON.parse(str);
    }
    catch (e) { }
    return false;
};

function updateScroll(){
    messageBox.scrollTop = messageBox.scrollHeight;
}

const displayNotification = (msg) => {
    const newNotification = document.createElement('h3');
    newNotification.classList.add('notification');

    const newMsgDiv = document.createElement('div');
    newMsgDiv.classList.add('messageDiv');
    newMsgDiv.appendChild(newNotification);

    newNotification.textContent = msg;

    messageBox.appendChild(newMsgDiv);
    updateScroll();
};

// displayNotification(userName+' joined the chat');

const displayMsg = (msg, source, owner, msgId) => {
    const newMsg = document.createElement('pre');
    newMsg.classList.add('message');

    if(msgId)
        newMsg.setAttribute('id', msgId);

    const newMsgDiv = document.createElement('div');
    newMsgDiv.classList.add('messageDiv');
    newMsgDiv.appendChild(newMsg);
    if(source === 'Self') {
        newMsgDiv.classList.add('push_right');
    }
    else 
        audio.play();

    if(owner)
        newMsg.textContent = `${owner}:\n${msg}`;
    else 
        newMsg.textContent = msg;

    messageBox.appendChild(newMsgDiv);
    updateScroll();
};


const port = 8080;

// const ws = new WebSocket(document.URL);
// let ws = new WebSocket(`ws://localhost:${port}`);  //For localhost

// let ws = new WebSocket(`wss://${document.domain}`);    //For cloud deployment

let ws = {readyState: 3};

const handleWS = () => {

    // console.log('readyState = ',ws.readyState);
    if(ws.readyState === 3){
        try{
            // ws = new WebSocket(`ws://localhost:${port}`);  //For localhost
             ws = new WebSocket(`wss://${document.domain}`);  //For cloud deploy
             ws.onopen = ()=>{
                console.log('Opened conection from setIntervel');
                ws.send(JSON.stringify({roomId, userName}));
                button.disabled = false;
            }

            ws.addEventListener('message', ( event ) => {       //It finally worked
                const parsedData = parseIfValifJSON( event.data );
                if(parsedData.notification){
                    displayNotification(parsedData.notification);
                    console.log('Notification:', parsedData.notification);
                }
                if(parsedData.message){
                    displayMsg(parsedData.message, 'Server', parsedData.userName);
                    console.log(event.data);
                }
                if(parsedData.recieved){
                    document.querySelector(`#${parsedData.recieved}`).style.backgroundColor = 'green';
                }
                if(parsedData.roomId){
                    roomName.textContent = `RoomId: ${parsedData.roomId}`;
                }
                if(parsedData.onlineUsers){
                    console.log('onlineUsers:',parsedData.onlineUsers)
                    onlineCountDiv.textContent = `Online: ${parsedData.onlineUsers.length}`;
                    onlineUsersDiv.innerHTML = '';
                    parsedData.onlineUsers.forEach(member => {
                        const memberName = document.createElement('p');
                        memberName.innerHTML = `${member} <i class="fa-solid fa-circle"></i>`;
                        onlineUsersDiv.appendChild(memberName);
                    });
                }
            })


        }
        catch(e) {
            console.log('Can\'t connect to web socket');
        }
    }



    setTimeout(handleWS, 2000);
}


handleWS();




const removeBlankChar = (obj, si) => {
    obj.value = obj.value.slice(si);
    const len = obj.value.length;
    let li = len;
    for(let i = len-1; i>=0; i--) {
        if(obj.value[i]===' ' || obj.value[i]==='\n')
        li = i;
        else break;
    }
    obj.value = obj.value.slice(0,li);
}

const isNonEmpty = (obj) => {
    for(let i = 0; i<obj.value.length; i++){
        if(obj.value[i]!=' '&&obj.value[i]!='\n'){
            removeBlankChar(obj, i);
            return true;
        }
    }
    return false;
}

button.addEventListener('click', event => {
    const msgId = 'm' + new Date().getTime();
    event.preventDefault();

    if(isNonEmpty(input)){
        // console.log('iv=',input.value)
        ws.send(JSON.stringify( {message: input.value, msgId } ));  //Sending message id along with msg
        displayMsg(input.value, 'Self', 'You', msgId);
    }
    input.value = "";
});

input.addEventListener('keydown',(event)=> {
    if(event.key == 'Enter'){ 
        if(!event.shiftKey){
            button.click();
            event.preventDefault(); 
        }
}
    
    console.log(event);
});

onlineCountDiv.addEventListener('click', event => {
    onlineUsersDiv.classList.toggle('visible');
    event.preventDefault();
});
