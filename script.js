// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnKlbnH43N_XOFROyQ9jY09ifbIJeW2VA",
    authDomain: "silent-voices-a3a02.firebaseapp.com",
    databaseURL: "https://console.firebase.google.com/u/0/project/silent-voices-a3a02/database/silent-voices-a3a02-default-rtdb/data/~2F",
    projectId: "silent-voices-a3a02",
    storageBucket: "silent-voices-a3a02.appspot.com",
    messagingSenderId: "950242231819",
    appId: "1:950242231819:web:d0eaa5d52ad2be0840690e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const recipientInput = document.getElementById('recipient');
    const messageInput = document.getElementById('message');
    const messageList = document.getElementById('messageList');
    const loadingDiv = document.getElementById('loading');

    let lastKey = null;
    const messagesPerPage = 10;

    function addMessageToList(key, message) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>To: ${message.recipient}</strong>${message.message}`;
        li.setAttribute('data-key', key);
        messageList.appendChild(li);
    }

    function loadMessages() {
        loadingDiv.style.display = 'block';
        let query = database.ref('messages').orderByKey().limitToLast(messagesPerPage);
        
        if (lastKey) {
            query = query.endBefore(lastKey);
        }

        query.once('value').then((snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                messages.unshift({key: childSnapshot.key, ...childSnapshot.val()});
            });

            messages.forEach((message) => {
                addMessageToList(message.key, message);
            });

            if (messages.length > 0) {
                lastKey = messages[0].key;
            }

            loadingDiv.style.display = 'none';
        });
    }

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const recipient = recipientInput.value;
        const message = messageInput.value;
        
        if (recipient.trim() !== '' && message.trim() !== '') {
            // Push a new message to the database
            const newMessageRef = database.ref('messages').push();
            newMessageRef.set({
                recipient: recipient,
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
            
            recipientInput.value = '';
            messageInput.value = '';

            // Clear the message list and reset lastKey
            messageList.innerHTML = '';
            lastKey = null;
            loadMessages();
        }
    });

    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMessages();
        }
    });

    // Initial load
    loadMessages();
});
