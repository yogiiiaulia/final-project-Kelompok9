'use strict';
const pool = require('../config/db');
/**
 * GET /
 * Landing page
 */
async function showHome(req, res, next) {
  try {
    // Get section count for hero stats
    const sectionsResult = await pool.query('SELECT COUNT(*) FROM sections');
    const blocksResult = await pool.query('SELECT COUNT(*) FROM content_blocks');
    res.render('home', {
      title: 'Weaponization of AI in Cybersecurity — E-Learning Platform',
      sectionCount: sectionsResult.rows[0].count,
      blockCount: blocksResult.rows[0].count,
    });
  } catch (err) {
    next(err);
  }
}
/**
 * GET /materi
 * Redirect to first section
 */
async function showMaterialIndex(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT id FROM sections ORDER BY urutan ASC LIMIT 1'
    );
    if (result.rows.length === 0) {
      return res.redirect('/');
    }
    res.redirect(`/materi/${result.rows[0].id}`);
  } catch (err) {
    next(err);
  }
}
/**
 * GET /materi/:id
 * Show specific section with all content blocks
 */
async function showSection(req, res, next) {
  try {
    const sectionId = parseInt(req.params.id, 10);
    if (isNaN(sectionId)) {
      const err = new Error('ID section tidak valid.');
      err.status = 400;
      return next(err);
    }
    // Get all sections for sidebar
    const sectionsResult = await pool.query(
      'SELECT id, judul_bagian, urutan FROM sections ORDER BY urutan ASC'
    );
    // Get current section
    const sectionResult = await pool.query(
      'SELECT id, judul_bagian, urutan FROM sections WHERE id = $1',
      [sectionId]
    );
    if (sectionResult.rows.length === 0) {
      // Smart fallback: if ID is a content_block ID, redirect to its parent section
      const blockCheck = await pool.query(
        'SELECT section_id FROM content_blocks WHERE id = $1',
        [sectionId]
      );
      if (blockCheck.rows.length > 0) {
        return res.redirect(`/materi/${blockCheck.rows[0].section_id}#block-${sectionId}`);
      }
      const err = new Error('Section tidak ditemukan.');
      err.status = 404;
      return next(err);
    }
    const currentSection = sectionResult.rows[0];
    // Get content blocks for this section
    const blocksResult = await pool.query(
      `SELECT id, judul_sub, konten, urutan
       FROM content_blocks
       WHERE section_id = $1
       ORDER BY urutan ASC`,
      [sectionId]
    );
    // Get prev/next section for navigation
    const prevResult = await pool.query(
      'SELECT id, judul_bagian FROM sections WHERE urutan < $1 ORDER BY urutan DESC LIMIT 1',
      [currentSection.urutan]
    );
    const nextResult = await pool.query(
      'SELECT id, judul_bagian FROM sections WHERE urutan > $1 ORDER BY urutan ASC LIMIT 1',
      [currentSection.urutan]
    );
    res.render('material', {
      title: `${currentSection.judul_bagian} — WeapAI Platform`,
      sections: sectionsResult.rows,
      currentSection,
      blocks: blocksResult.rows,
      prevSection: prevResult.rows[0] || null,
      nextSection: nextResult.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
}
module.exports = { showHome, showMaterialIndex, showSection };
