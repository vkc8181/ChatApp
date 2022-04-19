console.log('script.js included');

const messageBox = document.querySelector('#messageBox');
const input = document.querySelector('input');
const button = document.querySelector('button');
const form = document.querySelector('form');

button.disabled = true;

function updateScroll(){
    messageBox.scrollTop = messageBox.scrollHeight;
}

const displayMsg = (msg, source) => {
    const newMsg = document.createElement('p');
    newMsg.classList.add('message');
    const newMsgDiv = document.createElement('div');
    newMsgDiv.classList.add('messageDiv');
    newMsgDiv.appendChild(newMsg);
    if(source === 'Self') {
        newMsgDiv.classList.add('push_right');
        newMsg.style.backgroundColor = 'green';
    }
    newMsg.textContent = msg;
    messageBox.appendChild(newMsgDiv);
    updateScroll();
};
const port = 1234;

// const ws = new WebSocket(document.URL);
const ws = new WebSocket(`ws://localhost:${port}`);

ws.onopen = ()=>{
    button.disabled = false;
}

ws.onmessage = event => {
    displayMsg(event.data, 'Server');
    console.log(event.data);
};

const isNonEmpty = (msg) => {
    for(let i = 0; i<msg.length; i++){
        if(msg[i]!=' ') 
        return true;
    }
    return false;
}

button.addEventListener('click', event => {
    event.preventDefault();
    // event.stopPropagation();
    let msg = input.value;
    console.log('isNonEmpty(msg)=',isNonEmpty(msg));
    if(isNonEmpty(msg)){
        ws.send(msg);
        displayMsg(msg, 'Self');
    }
    input.value = "";
});