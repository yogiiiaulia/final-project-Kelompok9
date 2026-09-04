/**
 * Weaponized AI E-Learning Platform — Client-Side Application JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingChatbot();
  initFullpageChat();
  initShortcutPrompts();
  initConfirmDelete();
  initAutoDismissAlerts();
});

/**
 * Basic Markdown parsing helper for AI responses
 */
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Inline code `code`
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Bullet points
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraph breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  return `<p>${html}</p>`;
}

/**
 * Floating Chatbot Widget Handler
 */
function initFloatingChatbot() {
  const fab = document.getElementById('chatbot-fab');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('widget-send-btn');
  const inputEl = document.getElementById('widget-input');
  const messagesBox = document.getElementById('widget-messages');

  if (!fab || !windowEl) return;

  fab.addEventListener('click', () => {
    windowEl.classList.toggle('open');
    if (windowEl.classList.contains('open') && inputEl) {
      inputEl.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      windowEl.classList.remove('open');
    });
  }

  async function sendWidgetMessage() {
    if (!inputEl) return;
    const message = inputEl.value.trim();
    if (!message) return;

    // Append User Message
    appendMessage(messagesBox, message, 'user');
    inputEl.value = '';

    // Typing Indicator
    const typingId = appendTypingIndicator(messagesBox);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      removeTypingIndicator(typingId);

      if (data.success) {
        appendMessage(messagesBox, data.answer, 'ai', data.sources);
      } else {
        appendMessage(messagesBox, data.error || 'Terjadi kesalahan.', 'ai');
      }
    } catch (err) {
      removeTypingIndicator(typingId);
      appendMessage(messagesBox, 'Gagal terhubung ke server. Periksa koneksi Anda.', 'ai');
    }
  }

  if (sendBtn) sendBtn.addEventListener('click', sendWidgetMessage);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendWidgetMessage();
      }
    });
  }
}

/**
 * Fullpage Chat Interface Handler
 */
function initFullpageChat() {
  const sendBtn = document.getElementById('chat-send-btn');
  const inputEl = document.getElementById('chat-input');
  const messagesBox = document.getElementById('chat-messages');

  if (!sendBtn || !inputEl || !messagesBox) return;

  async function sendChatMessage() {
    const message = inputEl.value.trim();
    if (!message) return;

    // Append User Message
    appendMessage(messagesBox, message, 'user');
    inputEl.value = '';

    // Typing Indicator
    const typingId = appendTypingIndicator(messagesBox);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      removeTypingIndicator(typingId);

      if (data.success) {
        appendMessage(messagesBox, data.answer, 'ai', data.sources);
      } else {
        appendMessage(messagesBox, data.error || 'Terjadi kesalahan.', 'ai');
      }
    } catch (err) {
      removeTypingIndicator(typingId);
      appendMessage(messagesBox, 'Gagal terhubung ke server. Coba beberapa saat lagi.', 'ai');
    }
  }

  sendBtn.addEventListener('click', sendChatMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });
}

/**
 * Append Message to Chat Box
 */
function appendMessage(container, text, role, sources = []) {
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'chat-avatar';
  avatarDiv.innerHTML = role === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'chat-bubble';
  bubbleDiv.innerHTML = renderMarkdown(text);

  if (sources && sources.length > 0) {
    const sourcesDiv = document.createElement('div');
    sourcesDiv.className = 'chat-sources';
    sourcesDiv.innerHTML = '<strong><i class="fas fa-book-open me-1"></i>Sumber Referensi Materi:</strong><br>';
    sources.forEach(src => {
      const chip = document.createElement('a');
      chip.className = 'source-chip';
      chip.href = `/materi/${src.section_id || src.id}#block-${src.id}`;
      chip.target = '_blank';
      chip.innerHTML = `<i class="fas fa-link"></i> ${src.judul_bagian} - ${src.judul_sub}`;
      sourcesDiv.appendChild(chip);
    });
    bubbleDiv.appendChild(sourcesDiv);
  }

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);

  container.scrollTop = container.scrollHeight;
}

/**
 * Typing Indicator Helpers
 */
function appendTypingIndicator(container) {
  const id = 'typing-' + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.id = id;
  msgDiv.className = 'chat-msg ai';

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'chat-avatar';
  avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'chat-bubble text-muted';
  bubbleDiv.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Menganalisis basis pengetahuan...';

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

/**
 * Prompt Shortcut Cards
 */
function initShortcutPrompts() {
  const shortcutButtons = document.querySelectorAll('.prompt-shortcut-btn');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const promptText = btn.getAttribute('data-prompt');
      if (promptText && chatInput) {
        chatInput.value = promptText;
        if (sendBtn) sendBtn.click();
      }
    });
  });
}

/**
 * Confirm Delete dialogs
 */
function initConfirmDelete() {
  document.querySelectorAll('.btn-confirm-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Auto-dismiss alerts after 5s
 */
function initAutoDismissAlerts() {
  setTimeout(() => {
    document.querySelectorAll('.alert-auto-dismiss').forEach(alert => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.5s ease';
      setTimeout(() => alert.remove(), 500);
    });
  }, 5000);
}
