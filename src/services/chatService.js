'use strict';
const pool = require('../config/db');
const { findRelevantBlocks, formatContext } = require('./retrievalService');
const { generateResponse } = require('./llmService');
// Out-of-scope refusal message
const OUT_OF_SCOPE_MESSAGE =
  'Maaf, pertanyaan tersebut berada di luar cakupan materi pembelajaran ' +
  '"Weaponization of AI in Cybersecurity" yang tersedia pada platform ini. ' +
  'Silakan ajukan pertanyaan yang berkaitan dengan materi yang tersedia, seperti ' +
  'weaponized AI, kategori ancaman, metodologi systematic review, atau temuan penelitian Nobles.';
/**
 * Get or create a chat session
 * Supports anonymous (no userId) and authenticated users
 */
async function getOrCreateSession(sessionId, userId = null) {
  if (sessionId) {
    const existing = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = $1',
      [sessionId]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }
  }
  // Create new session
  const result = await pool.query(
    'INSERT INTO chat_sessions (user_id) VALUES ($1) RETURNING id',
    [userId || null]
  );
  return result.rows[0].id;
}
/**
 * Save a message to the database
 */
async function saveMessage(sessionId, pesan, role, referencedIds = []) {
  await pool.query(
    `INSERT INTO chat_messages (session_id, pesan, role, referenced_content_ids)
     VALUES ($1, $2, $3, $4)`,
    [sessionId, pesan, role, JSON.stringify(referencedIds)]
  );
}
/**
 * Main RAG pipeline:
 * 1. Validate input
 * 2. Retrieve relevant content blocks
 * 3. If no context → return refusal (don't call LLM)
 * 4. Format context
 * 5. Call Gemini API
 * 6. Save to DB
 * 7. Return response + sources
 *
 * @param {string} question - User question
 * @param {number|null} chatSessionId - Existing session ID
 * @param {number|null} userId - Authenticated user ID
 * @returns {Promise<Object>} - { answer, sources, sessionId, outOfScope }
 */
async function processChat(question, chatSessionId = null, userId = null) {
  // 1. Get/create session
  const sessionId = await getOrCreateSession(chatSessionId, userId);
  // 2. Save user message
  await saveMessage(sessionId, question, 'user');
  // 3. Retrieve relevant blocks
  const relevantBlocks = await findRelevantBlocks(question);
  // 4. If no relevant context found — refuse without calling LLM
  if (!relevantBlocks || relevantBlocks.length === 0) {
    await saveMessage(sessionId, OUT_OF_SCOPE_MESSAGE, 'ai', []);
    return {
      answer: OUT_OF_SCOPE_MESSAGE,
      sources: [],
      sessionId,
      outOfScope: true,
    };
  }
  // 5. Format context for LLM
  const context = formatContext(relevantBlocks);
  const referencedIds = relevantBlocks.map((b) => b.id);
  // 6. Call Gemini API
  const answer = await generateResponse(question, context);
  // 7. Save AI response
  await saveMessage(sessionId, answer, 'ai', referencedIds);
  // 8. Build source references (judul_sub of blocks used)
  const sources = relevantBlocks.map((b) => ({
    id: b.id,
    section_id: b.section_id,
    judul_sub: b.judul_sub,
    judul_bagian: b.judul_bagian,
  }));
  return {
    answer,
    sources,
    sessionId,
    outOfScope: false,
  };
}
/**
 * Get chat history for a session
 */
async function getChatHistory(sessionId) {
  if (!sessionId) return [];
  const result = await pool.query(
    `SELECT pesan, role, referenced_content_ids, timestamp
     FROM chat_messages
     WHERE session_id = $1
     ORDER BY timestamp ASC`,
    [sessionId]
  );
  return result.rows;
}
module.exports = { processChat, getChatHistory, getOrCreateSession };