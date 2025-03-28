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

  // Function to show iframe
  function showIframe() {
    iframeContainer.style.display = 'block';
    icon.style.display = 'none';
  }

  // Function to hide iframe
  function hideIframe() {
    iframeContainer.style.display = 'none';
    icon.style.display = 'flex';
  }

  // Handle click on icon
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    showIframe();
  });

  // Handle click on close button
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    hideIframe();
  });

  // Handle click outside
  document.addEventListener('click', (e) => {
    const isClickInside = container.contains(e.target);
    if (!isClickInside && iframeContainer.style.display === 'block') {
      hideIframe();
    }
  });

  // Prevent clicks inside iframe from closing it
  iframeContainer.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Initialize the chatbot
createChatbotContainer(); 