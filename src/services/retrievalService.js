'use strict';
const pool = require('../config/db');

const MAX_RESULTS = 5;

// Indonesian & English stopwords list for clean keyword extraction
const STOPWORDS = new Set([
  'apa', 'siapa', 'mengapa', 'kenapa', 'bagaimana', 'dimana', 'kapan', 'apakah', 'yang', 'dan', 'di', 'ke', 'dari',
  'ini', 'itu', 'pada', 'adalah', 'dengan', 'untuk', 'oleh', 'sebagai', 'akan', 'atau', 'juga', 'dalam',
  'tersebut', 'bisa', 'dapat', 'ada', 'tidak', 'bukan', 'hanya', 'proses', 'secara', 'mengenai', 'jelaskan',
  'tentang', 'apa', 'saja', 'sebutkan', 'bagaimanakah', 'seberapa', 'mana', 'what', 'how', 'why', 'who', 'where',
  'when', 'which', 'is', 'are', 'was', 'were', 'the', 'in', 'on', 'at', 'of', 'for', 'with', 'by', 'an', 'a'
]);

/**
 * Extract clean, meaningful keywords from user question
 */
function extractKeywords(question) {
  if (!question || typeof question !== 'string') return [];
  return question
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Find relevant content blocks using PostgreSQL Full-Text Search with smart keyword fallback
 *
 * @param {string} question - User's question
 * @returns {Promise<Array>} - Array of relevant content blocks with scores
 */
async function findRelevantBlocks(question) {
  if (!question || typeof question !== 'string') return [];
  const cleanQuestion = question.trim().substring(0, 1000);
  const keywords = extractKeywords(cleanQuestion);

  try {
    // 1. Primary FTS: Exact phrase / plainto_tsquery search
    const ftsResult = await pool.query(
      `SELECT
          cb.id,
          cb.judul_sub,
          cb.konten,
          cb.section_id,
          s.judul_bagian,
          GREATEST(
            ts_rank(cb.search_vector, plainto_tsquery('english', $1)),
            ts_rank(cb.search_vector, plainto_tsquery('simple', $1))
          ) AS score
       FROM content_blocks cb
       JOIN sections s ON cb.section_id = s.id
       WHERE
         cb.search_vector @@ plainto_tsquery('english', $1)
         OR cb.search_vector @@ plainto_tsquery('simple', $1)
       ORDER BY score DESC
       LIMIT $2`,
      [cleanQuestion, MAX_RESULTS]
    );

    if (ftsResult.rows.length > 0) {
      return ftsResult.rows;
    }

    // 2. Secondary FTS: OR-based keywords query (handles flexible natural language)
    if (keywords.length > 0) {
      const tsQueryStr = keywords.join(' | ');
      const orFtsResult = await pool.query(
        `SELECT
            cb.id,
            cb.judul_sub,
            cb.konten,
            cb.section_id,
            s.judul_bagian,
            ts_rank(cb.search_vector, to_tsquery('simple', $1)) AS score
         FROM content_blocks cb
         JOIN sections s ON cb.section_id = s.id
         WHERE cb.search_vector @@ to_tsquery('simple', $1)
         ORDER BY score DESC
         LIMIT $2`,
        [tsQueryStr, MAX_RESULTS]
      );

      if (orFtsResult.rows.length > 0) {
        return orFtsResult.rows;
      }
    }

    // 3. Fallback: Ranked ILIKE keyword search with scoring based on non-stop words
    const searchWords = keywords.length > 0 ? keywords : cleanQuestion.split(/\s+/).filter((w) => w.length > 2).slice(0, 5);
    if (searchWords.length === 0) return [];

    const scoreCases = searchWords
      .map((_, i) => `(CASE WHEN cb.judul_sub ILIKE $${i + 1} OR cb.konten ILIKE $${i + 1} THEN 1 ELSE 0 END)`)
      .join(' + ');

    const likeParams = searchWords.map((w) => `%${w}%`);
    likeParams.push(MAX_RESULTS);

    const fallbackResult = await pool.query(
      `SELECT
          cb.id,
          cb.judul_sub,
          cb.konten,
          cb.section_id,
          s.judul_bagian,
          (${scoreCases}) AS score
       FROM content_blocks cb
       JOIN sections s ON cb.section_id = s.id
       WHERE (${scoreCases}) > 0
       ORDER BY score DESC, cb.id ASC
       LIMIT $${likeParams.length}`,
      likeParams
    );

    return fallbackResult.rows;
  } catch (err) {
    console.error('[RetrievalService] Error during retrieval:', err.message);
    return [];
  }
}

/**
 * Format retrieved blocks into a context string for the LLM prompt
 *
 * @param {Array} blocks - Retrieved content blocks
 * @returns {string} - Formatted context string
 */
function formatContext(blocks) {
  if (!blocks || blocks.length === 0) return '';
  return blocks
    .map((block, index) => {
      const plainContent = block.konten
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return `[CONTEXT ${index + 1}]
Section: ${block.judul_bagian}
Topic: ${block.judul_sub}
Content: ${plainContent}`;
    })
    .join('\n\n');
}

module.exports = { findRelevantBlocks, formatContext, extractKeywords };
