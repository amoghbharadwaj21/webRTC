const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', start);

let localStream;
let pc1;
let pc2;

async function start() {
    const configuration = {};
    pc1 = new RTCPeerConnection(configuration);
    pc2 = new RTCPeerConnection(configuration);

    pc1.addEventListener('icecandidate', event => {
        if (event.candidate) {
            pc2.addIceCandidate(event.candidate);
        }
    });

    pc2.addEventListener('icecandidate', event => {
        if (event.candidate) {
            pc1.addIceCandidate(event.candidate);
        }
    });

    pc2.addEventListener('track', event => {
        remoteVideo.srcObject = event.streams[0];
    });

    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    localVideo.srcObject = localStream;

    localStream.getTracks().forEach(track => {
        pc1.addTrack(track, localStream);
    });

    const offer = await pc1.createOffer();
    await pc1.setLocalDescription(offer);

    await pc2.setRemoteDescription(offer);
    const answer = await pc2.createAnswer();
    await pc2.setLocalDescription(answer);

    await pc1.setRemoteDescription(answer);
}

