'use strict';
const { processChat, getChatHistory, getOrCreateSession } = require('../services/chatService');
const { validateChatMessage } = require('../utils/validators');
/**
 * GET /chat
 * Chatbot fullpage view
 */
async function showChatPage(req, res, next) {
  try {
    const chatSessionId = req.session.chatSessionId || null;
    const history = chatSessionId ? await getChatHistory(chatSessionId) : [];
    res.render('chat', {
      title: 'AI Learning Assistant — WeapAI Platform',
      history,
      chatSessionId,
    });
  } catch (err) {
    next(err);
  }
}
/**
 * POST /api/chat
 * Main RAG chat endpoint
 */
async function handleChat(req, res, next) {
  try {
    const { message, sessionId } = req.body;
    // Validate input
    const errors = validateChatMessage({ message });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors[0],
      });
    }
    const chatSessionId = sessionId || req.session.chatSessionId || null;
    const userId = req.session.user?.id || null;
    // Process through RAG pipeline
    const result = await processChat(
      message.trim(),
      chatSessionId,
      userId
    );
    // Persist session ID for continuity
    req.session.chatSessionId = result.sessionId;
    return res.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      sessionId: result.sessionId,
      outOfScope: result.outOfScope,
    });
  } catch (err) {
    console.error('[ChatbotController] Error:', err.message);
    // User-friendly error messages
    let userMessage = 'Maaf, AI Assistant sedang mengalami gangguan. Silakan coba lagi beberapa saat.';
    if (err.message.includes('LLM_API_KEY')) {
      userMessage = 'AI Assistant belum dikonfigurasi. Hubungi administrator.';
    } else if (err.message.includes('timeout')) {
      userMessage = 'Koneksi ke AI timeout. Silakan coba lagi.';
    } else if (err.message.includes('Rate limit')) {
      userMessage = err.message;
    }
    return res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
}
module.exports = { showChatPage, handleChat };