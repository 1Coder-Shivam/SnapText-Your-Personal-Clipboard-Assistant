// Constants
const MAX_ENTRIES = 10;
const STORAGE_KEY = 'quickTextEntries';

// DOM Elements
const newTextInput = document.getElementById('newText');
const addButton = document.getElementById('addButton');
const textList = document.getElementById('textList');
const clearAllButton = document.getElementById('clearAll');

// Initialize the extension
document.addEventListener('DOMContentLoaded', () => {
  loadEntries();
  setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
  addButton.addEventListener('click', addNewEntry);
  clearAllButton.addEventListener('click', clearAllEntries);
  newTextInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addNewEntry();
    }
  });
}

// Load saved entries from storage
function loadEntries() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const entries = result[STORAGE_KEY] || [];
    renderEntries(entries);
  });
}

// Add a new entry
function addNewEntry() {
  const text = newTextInput.value.trim();
  if (!text) return;

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    let entries = result[STORAGE_KEY] || [];
    
    // Add new entry at the beginning
    entries.unshift(text);
    
    // Keep only the latest MAX_ENTRIES
    entries = entries.slice(0, MAX_ENTRIES);
    
    // Save to storage
    chrome.storage.local.set({ [STORAGE_KEY]: entries }, () => {
      renderEntries(entries);
      newTextInput.value = '';
      newTextInput.focus();
    });
  });
}

// Delete a specific entry
function deleteEntry(index) {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    let entries = result[STORAGE_KEY] || [];
    entries.splice(index, 1);
    
    chrome.storage.local.set({ [STORAGE_KEY]: entries }, () => {
      renderEntries(entries);
    });
  });
}

// Clear all entries
function clearAllEntries() {
  chrome.storage.local.set({ [STORAGE_KEY]: [] }, () => {
    renderEntries([]);
  });
}

// Copy text to clipboard
function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';  // Prevent scrolling to bottom
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  
  try {
    // Select the text and copy
    textarea.select();
    document.execCommand('copy');
    showCopyNotification();
  } catch (err) {
    console.error('Failed to copy text:', err);
  } finally {
    // Clean up
    document.body.removeChild(textarea);
  }
}

// Show copy notification
function showCopyNotification() {
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  notification.textContent = 'Copied to clipboard!';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 1000);
}

// Render the entries list
function renderEntries(entries) {
  textList.innerHTML = '';
  
  entries.forEach((text, index) => {
    const item = document.createElement('div');
    item.className = 'text-item';
    
    const content = document.createElement('div');
    content.className = 'text-content';
    content.textContent = text;
    
    const actions = document.createElement('div');
    actions.className = 'text-actions';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-copy';
    copyButton.textContent = 'Copy';
    copyButton.title = 'Copy to clipboard';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.title = 'Delete';
    
    actions.appendChild(copyButton);
    actions.appendChild(deleteButton);
    
    item.appendChild(content);
    item.appendChild(actions);
    
    copyButton.addEventListener('click', () => copyToClipboard(text));
    deleteButton.addEventListener('click', () => deleteEntry(index));
    
    textList.appendChild(item);
  });
} 