'use strict';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
/**
 * Build the RAG system prompt for Gemini
 */
function buildPrompt(question, context) {
  return `You are an educational assistant for the "Weaponization of AI in Cybersecurity" learning platform, based on the systematic review by Calvin Nobles (Procedia Computer Science 239, 2024, pages 547-555).
CRITICAL RULES:
1. You MUST answer ONLY using the provided CONTEXT below.
2. Do NOT use outside knowledge or general AI knowledge.
3. Do NOT invent facts not present in the context.
4. Do NOT contradict the provided context.
5. Preserve the terminology and categorization used in the source material exactly.
6. If the answer cannot be found in the provided CONTEXT, you MUST clearly state that the question is outside the available learning material.
7. Do not pretend to know information that is not in the context.
8. The source of truth is ONLY the learning material stored in this platform.
9. Respond in the same language as the question (Indonesian or English).
10. Be educational, clear, and helpful — but strictly within the context boundaries.
CONTEXT:
${context}
QUESTION:
${question}
ANSWER (based only on the context above):`;
}
/**
 * Call Google Gemini API to generate a response
 *
 * @param {string} question - User question
 * @param {string} context - Retrieved context from database
 * @returns {Promise<string>} - LLM response text
 */
async function generateResponse(question, context) {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
  if (!apiKey) {
    throw new Error('LLM_API_KEY tidak dikonfigurasi. Tambahkan LLM_API_KEY ke file .env');
  }
  const prompt = buildPrompt(question, context);
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,      // Low temperature for factual, faithful responses
      topK: 20,
      topP: 0.8,
      maxOutputTokens: 1024,
      stopSequences: [],
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[LLMService] Gemini API error:', response.status, errorBody);
      if (response.status === 400) {
        throw new Error('Request tidak valid. Periksa konfigurasi LLM_MODEL.');
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('API key tidak valid atau tidak memiliki akses. Periksa LLM_API_KEY.');
      } else if (response.status === 429) {
        throw new Error('Rate limit Gemini API tercapai. Coba lagi dalam beberapa menit.');
      } else {
        throw new Error(`Gemini API error: ${response.status}`);
      }
    }
    const data = await response.json();
    // Extract text from Gemini response
    const candidate = data?.candidates?.[0];
    if (!candidate) {
      throw new Error('Gemini API mengembalikan respons kosong.');
    }
    // Check for safety blocks
    if (candidate.finishReason === 'SAFETY') {
      return 'Maaf, respons tidak dapat ditampilkan karena alasan keamanan.';
    }
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text || text.trim().length === 0) {
      throw new Error('Gemini API mengembalikan teks kosong.');
    }
    return text.trim();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request ke Gemini API timeout. Coba lagi dalam beberapa saat.');
    }
    throw err;
  }
}
module.exports = { generateResponse };