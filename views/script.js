console.log('script.js included');

const messageBox = document.querySelector('#messageBox');
const input = document.querySelector('#input');
const button = document.querySelector('button');
const form = document.querySelector('form');

button.disabled = true;

function updateScroll(){
    messageBox.scrollTop = messageBox.scrollHeight;
}

const displayMsg = (msg, source) => {
    const newMsg = document.createElement('pre');
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
const port = 8080;

// const ws = new WebSocket(document.URL);
// const ws = new WebSocket(`ws://localhost:${port}`);
const ws = new WebSocket(`wss://${document.domain}`);

ws.onopen = ()=>{
    button.disabled = false;
}

ws.onmessage = event => {
    displayMsg(event.data, 'Server');
    console.log(event.data);
};

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
    event.preventDefault();
    // event.stopPropagation();
    // const isValid = isNonEmpty(input);
    // console.log('isNonEmpty(msg)=',isValid);
    if(isNonEmpty(input)){
        // console.log('iv=',input.value)
        ws.send(input.value);
        displayMsg(input.value, 'Self');
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
})