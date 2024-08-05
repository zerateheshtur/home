document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const recipientInput = document.getElementById('recipient');
    const messageInput = document.getElementById('message');
    const messageList = document.getElementById('messageList');
    const loadingDiv = document.getElementById('loading');

    let page = 1;
    const messagesPerPage = 10;
    let allMessages = [];

    function addMessage(recipient, message) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>To: ${recipient}</strong>${message}`;
        messageList.appendChild(li);
    }

    function loadMessages() {
        loadingDiv.style.display = 'block';
        // Simulating API call with setTimeout
        setTimeout(() => {
            for (let i = 0; i < messagesPerPage; i++) {
                const index = (page - 1) * messagesPerPage + i;
                if (index < allMessages.length) {
                    addMessage(allMessages[index].recipient, allMessages[index].message);
                }
            }
            page++;
            loadingDiv.style.display = 'none';
        }, 1000);
    }

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const recipient = recipientInput.value;
        const message = messageInput.value;
        
        if (recipient.trim() !== '' && message.trim() !== '') {
            allMessages.unshift({ recipient, message });
            messageList.innerHTML = '';
            page = 1;
            loadMessages();
            
            recipientInput.value = '';
            messageInput.value = '';
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
