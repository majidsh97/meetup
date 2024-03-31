//import * as lp from "@lottiefiles/lottie-player";
import anime from './anime.es.js';
import { setup } from './canvas1.js'

const SIGNALING_SERVER_URL = 'https://meetup.asia';
const TURN_SERVER_URL = 'vpn.meetup.asia:3478';
const TURN_SERVER_USERNAME = 'username';
const TURN_SERVER_CREDENTIAL = 'credential';
const PC_CONFIG = {
    iceServers: [
        {
            urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        },
        {
            urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        }
    ]
};

console.log('java script loadedddddddddd!' + SIGNALING_SERVER_URL)
console.log('log');
let socket = io(SIGNALING_SERVER_URL, { autoConnect: false });

//connect -> join room -> emit ready to room-> pc -> sendsession(webrtc)

let pc = null;
let localStream = null;
let remoteStreamElement = document.querySelector('#remoteStream');
const selfsteam = document.querySelector('#selfstream');
const nextbtn = document.getElementById("nextbtn");
const loading_file = '/stylesheets/loading1.mp4';
const textarea = document.getElementById('textarea');
const chat = document.getElementById('chat')
const stopbtn = document.getElementById('stopbtn');
const lp_tutorial = document.getElementsByClassName('toturial')[0];
//const lottie_loading = document.querySelector("lottie-player");
const lp_loading = document.getElementById("lp_loading");
const json_tutorial = "https://assets1.lottiefiles.com/private_files/lf30_uwlaovzb.json";
const json_load_circle = "https://assets3.lottiefiles.com/datafiles/qmqHijl3o0um7zS/data.json";
const json_load_cool = "https://assets3.lottiefiles.com/datafiles/QeC7XD39x4C1CIj/data.json";
const json_frog = "https://assets9.lottiefiles.com/temp/lf20_InzBsb.json";
const json_film = "https://assets10.lottiefiles.com/temp/lf20_NjaR5i.json";
const json_jump = "https://assets1.lottiefiles.com/temp/lf20_vJHGg6.json";
const json_film2 = "https://assets9.lottiefiles.com/datafiles/ZHlTlyhzTLf9ImW/data.json";
const json_pony = "https://assets9.lottiefiles.com/packages/lf20_kJNwM4.json";

lp_loading.setAttribute('src', json_load_cool)
var is_searching = false;
function close() {
    if (pc !== null) {
        pc.close();
        pc = null;
    }
}
//----------------------------- btn -------------------------------------------
stopbtn.onclick = (e) => {
    close();
    lp_tutorial.style.visibility = "visible"
    socket.emit('stop');
    is_searching = false;
    remoteStreamElement.style.visibility = 'hidden';
    lp_loading.style.visibility = 'hidden';
}

nextbtn.addEventListener('click', () => {
    if (localStream === null) {
        alert('please give camera permision,')
        getLocalStream();

    } else {
        socket.emit('next');
        lp_tutorial.style.visibility = "hidden"
        close();
        is_searching = true;
        loading()
    }

});
//----------------------------- btn ----------------------------------

window.onload = () => {
    anime({
        targets: 'body',
        opacity: [0, 1],
        duration: 2000,
        easing: 'easeInOutQuad'

    });
    let x = document.getElementsByClassName('toturial')[0];
    //x.style.left = 0;
    //x.style.top = 0;
    /*

    anime({
        targets: '.toturial',
        translateX: [0, x.offsetLeft],   
        duration: 2000,

    });
    */
}
function loading() {
    remoteStreamElement.srcObject = null;
    remoteStreamElement.style.visibility = 'hidden'
    lp_loading.style.visibility = 'visible'

    //remoteStreamElement.src = loading_file;
    //remoteStreamElement.load();
}

function showstream(event) {
    lp_loading.style.visibility = 'hidden'
    remoteStreamElement.srcObject = event.stream;
    remoteStreamElement.style.visibility = 'visible';
}




socket.on('data', (data) => {
    console.log('Data received: ', data);
    handleSignalingData(data);
});

socket.on('ready', () => {
    console.log('Ready');
    createPeerConnection();
    sendOffer();
});
socket.on('next', () => {
    console.log('next');
    close();
    loading();

});
let sendData = (data) => {
    socket.emit('data', data);
};
socket.on('message', (t) => {
    addp(t, 'reciever');
});



let getLocalStream = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then((stream) => {
            console.log('Stream found');
            localStream = stream;
            selfsteam.srcObject = stream;

            // Connect after making sure that local stream is availble
            socket.connect();
        })
        .catch(error => {
            console.error('Stream not found: ', error);
        });
}

let createPeerConnection = () => {
    try {
        pc = new RTCPeerConnection(PC_CONFIG);
        pc.onicecandidate = onIceCandidate;
        pc.onaddstream = onAddStream;
        pc.addStream(localStream);

        console.log('PeerConnection created');
    } catch (error) {
        console.error('PeerConnection failed: ', error);
    }
};

let sendOffer = () => {
    console.log('Send offer');
    pc.createOffer().then(
        setAndSendLocalDescription,
        (error) => { console.error('Send offer failed: ', error); }
    );
};

let sendAnswer = () => {
    console.log('Send answer');
    pc.createAnswer().then(
        setAndSendLocalDescription,
        (error) => { console.error('Send answer failed: ', error); }
    );
};

let setAndSendLocalDescription = (sessionDescription) => {
    pc.setLocalDescription(sessionDescription);
    console.log('Local description set');
    sendData(sessionDescription);
};
let onIceCandidate = (event) => {
    if (event.candidate) {
        console.log('ICE candidate');
        sendData({
            type: 'candidate',
            candidate: event.candidate
        });
    }
};

let onAddStream = (event) => {
    console.log('Add stream');
    showstream(event);
};


let handleSignalingData = (data) => {
    switch (data.type) {
        case 'offer':
            createPeerConnection();
            pc.setRemoteDescription(new RTCSessionDescription(data));
            sendAnswer();
            break;
        case 'answer':
            pc.setRemoteDescription(new RTCSessionDescription(data));
            break;
        case 'candidate':
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            break;
    }
};



function addp(t, c) {
    let p = document.createElement('p')
    p.textContent = t
    p.classList.add("p");
    p.classList.add(c);
    chat.appendChild(p)
    chat.scrollTop = chat.scrollHeight;

}

textarea.addEventListener("keydown", function (event) {
    //&& !event.shiftKey
    console.log('k');
    if (event.keyCode === 13 || event.which === 13 && !event.shiftKey) {
        addp(textarea.value, 'sender')
        socket.emit('message', textarea.value);
        event.target.value = '';
        event.preventDefault();
    }
});

getLocalStream();


/*------------------------------------canvas --------------------*/
setup();