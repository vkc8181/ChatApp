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

const ws = new WebSocket('ws://localhost:1234');

ws.onopen = ()=>{
    button.disabled = false;
}

ws.onmessage = event => {
    displayMsg(event.data, 'Server');
    console.log(event.data);
};


button.addEventListener('click', event => {
    event.preventDefault();
    // event.stopPropagation();
    ws.send(input.value);
    displayMsg(input.value, 'Self');
    input.value = "";
});