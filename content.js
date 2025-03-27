// Create and inject the chatbot container
function createChatbotContainer() {
  const container = document.createElement('div');
  container.id = 'quicktext-chatbot-container';
  container.innerHTML = `
    <div id="quicktext-chatbot-icon">
      <span>💬</span>
    </div>
    <div id="quicktext-chatbot-iframe-container" style="display: none;">
      <iframe id="quicktext-chatbot-iframe" src="${chrome.runtime.getURL('popup.html')}"></iframe>
      <div id="quicktext-chatbot-close">×</div>
    </div>
  `;
  document.body.appendChild(container);

  // Add event listeners
  const icon = container.querySelector('#quicktext-chatbot-icon');
  const iframeContainer = container.querySelector('#quicktext-chatbot-iframe-container');
  const closeButton = container.querySelector('#quicktext-chatbot-close');

  icon.addEventListener('click', () => {
    iframeContainer.style.display = 'block';
    icon.style.display = 'none';
  });

  closeButton.addEventListener('click', () => {
    iframeContainer.style.display = 'none';
    icon.style.display = 'flex';
  });
}

// Initialize the chatbot
createChatbotContainer(); 