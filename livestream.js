const chatForm = document.getElementById('chat-form');
const messagesDiv = document.getElementById('messages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();

  if (username && message) {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message');
    msgElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    document.getElementById('message').value = '';
  }
});
