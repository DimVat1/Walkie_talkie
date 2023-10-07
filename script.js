document.addEventListener('DOMContentLoaded', () => {
    const createRoomBtn = document.getElementById('createRoomBtn');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const output = document.getElementById('output');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const microphoneInput = document.getElementById('microphoneInput');
    let isTransmitting = false;
    let audioStream;

    const socket = io(); // Initialize socket.io connection

    // Handle room creation
    createRoomBtn.addEventListener('click', () => {
        const roomName = document.getElementById('roomName').value;
        socket.emit('createRoom', roomName);
    });

    // Handle room joining
    joinRoomBtn.addEventListener('click', () => {
        const roomName = document.getElementById('roomName').value;
        socket.emit('joinRoom', roomName);
    });

    // Handle WebRTC signaling (Offer, Answer, IceCandidate)
    // This part depends on your WebRTC implementation
    // You'll need to set up WebRTC peer connections and signaling between peers.

    // Handle microphone input (start and stop)
    function startMicrophone() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                audioStream = stream;
                microphoneInput.srcObject = stream;
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    }

    function stopMicrophone() {
        if (audioStream) {
            const tracks = audioStream.getTracks();
            tracks.forEach((track) => track.stop());
        }
        microphoneInput.srcObject = null;
    }

    // Handle transmission start and stop
    function startTransmission() {
        isTransmitting = true;
        output.innerHTML = 'Transmitting... (Press "Stop" to end transmission)';
        startMicrophone();
    }

    function stopTransmission() {
        isTransmitting = false;
        output.innerHTML = 'Transmission stopped.';
        stopMicrophone();
    }

    // Event listeners for starting and stopping transmission
    document.getElementById('startBtn').addEventListener('click', startTransmission);
    document.getElementById('stopBtn').addEventListener('click', stopTransmission);

    // Send messages when the "Send" button is clicked
    sendBtn.addEventListener('click', () => {
        if (isTransmitting) {
            const message = messageInput.value;
            output.innerHTML += `<div>You: ${message}</div>`;
            messageInput.value = '';
        } else {
            output.innerHTML = 'You must start transmission before sending a message.';
        }
    });

    // Event listeners for WebRTC signaling (Offer, Answer, IceCandidate)
    // Implement your WebRTC signaling logic here.
});
