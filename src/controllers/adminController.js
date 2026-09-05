'use strict';
const pool = require('../config/db');
const { sanitizeContent } = require('../utils/sanitize');
const { validateSection, validateContentBlock } = require('../utils/validators');
// ─── DASHBOARD ───────────────────────────────────────────────
async function showDashboard(req, res, next) {
  try {
    const [sectionsRes, blocksRes, sessionsRes, messagesRes] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM sections'),
      pool.query('SELECT COUNT(*) FROM content_blocks'),
      pool.query('SELECT COUNT(*) FROM chat_sessions'),
      pool.query('SELECT COUNT(*) FROM chat_messages'),
    ]);
    const recentMessages = await pool.query(
      `SELECT cm.pesan, cm.role, cm.timestamp, cs.id AS session_id
       FROM chat_messages cm
       JOIN chat_sessions cs ON cm.session_id = cs.id
       ORDER BY cm.timestamp DESC
       LIMIT 10`
    );
    res.render('admin/dashboard', {
      title: 'Dashboard Admin — WeapAI Platform',
      stats: {
        sections: sectionsRes.rows[0].count,
        blocks: blocksRes.rows[0].count,
        sessions: sessionsRes.rows[0].count,
        messages: messagesRes.rows[0].count,
      },
      recentMessages: recentMessages.rows,
    });
  } catch (err) {
    next(err);
  }
}
// ─── SECTIONS ────────────────────────────────────────────────
async function listSections(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT s.id, s.judul_bagian, s.urutan,
              COUNT(cb.id) AS block_count
       FROM sections s
       LEFT JOIN content_blocks cb ON cb.section_id = s.id
       GROUP BY s.id, s.judul_bagian, s.urutan
       ORDER BY s.urutan ASC`
    );
    res.render('admin/sections', {
      title: 'Kelola Sections — Admin',
      sections: result.rows,
      error: null,
      success: req.query.success || null,
    });
  } catch (err) {
    next(err);
  }
}
async function createSection(req, res, next) {
  const { judul_bagian, urutan } = req.body;
  const errors = validateSection({ judul_bagian, urutan });
  if (errors.length > 0) {
    const sections = await pool
      .query('SELECT * FROM sections ORDER BY urutan ASC')
      .then((r) => r.rows)
      .catch(() => []);
    return res.render('admin/sections', {
      title: 'Kelola Sections — Admin',
      sections,
      error: errors[0],
      success: null,
    });
  }
  try {
    await pool.query(
      'INSERT INTO sections (judul_bagian, urutan) VALUES ($1, $2)',
      [judul_bagian.trim(), parseInt(urutan, 10)]
    );
    res.redirect('/admin/sections?success=Section+berhasil+ditambahkan');
  } catch (err) {
    if (err.code === '23505') {
      const sections = await pool.query('SELECT * FROM sections ORDER BY urutan ASC').then((r) => r.rows);
      return res.render('admin/sections', {
        title: 'Kelola Sections — Admin',
        sections,
        error: 'Urutan tersebut sudah digunakan. Gunakan urutan yang berbeda.',
        success: null,
      });
    }
    next(err);
  }
}
async function showEditSection(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM sections WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      const err = new Error('Section tidak ditemukan.');
      err.status = 404;
      return next(err);
    }
    res.render('admin/edit-section', {
      title: 'Edit Section — Admin',
      section: result.rows[0],
      error: null,
    });
  } catch (err) {
    next(err);
  }
}
async function updateSection(req, res, next) {
  const { judul_bagian, urutan } = req.body;
  const errors = validateSection({ judul_bagian, urutan });
  if (errors.length > 0) {
    const result = await pool.query('SELECT * FROM sections WHERE id = $1', [req.params.id]);
    return res.render('admin/edit-section', {
      title: 'Edit Section — Admin',
      section: result.rows[0] || {},
      error: errors[0],
    });
  }
  try {
    await pool.query(
      'UPDATE sections SET judul_bagian = $1, urutan = $2, updated_at = NOW() WHERE id = $3',
      [judul_bagian.trim(), parseInt(urutan, 10), req.params.id]
    );
    res.redirect('/admin/sections?success=Section+berhasil+diperbarui');
  } catch (err) {
    if (err.code === '23505') {
      const result = await pool.query('SELECT * FROM sections WHERE id = $1', [req.params.id]);
      return res.render('admin/edit-section', {
        title: 'Edit Section — Admin',
        section: result.rows[0] || {},
        error: 'Urutan tersebut sudah digunakan.',
      });
    }
    next(err);
  }
}
async function deleteSection(req, res, next) {
  try {
    await pool.query('DELETE FROM sections WHERE id = $1', [req.params.id]);
    res.redirect('/admin/sections?success=Section+berhasil+dihapus');
  } catch (err) {
    next(err);
  }
}
// ─── CONTENT BLOCKS ──────────────────────────────────────────
async function listContent(req, res, next) {
  try {
    const sectionFilter = req.query.section ? parseInt(req.query.section, 10) : null;
    let query = `
      SELECT cb.id, cb.judul_sub, cb.urutan, cb.section_id, s.judul_bagian,
             LEFT(cb.konten, 150) AS konten_preview
      FROM content_blocks cb
      JOIN sections s ON cb.section_id = s.id
    `;
    const params = [];
    if (sectionFilter) {
      query += ' WHERE cb.section_id = $1';
      params.push(sectionFilter);
    }
    query += ' ORDER BY s.urutan ASC, cb.urutan ASC';
    const [blocksResult, sectionsResult] = await Promise.all([
      pool.query(query, params),
      pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC'),
    ]);
    res.render('admin/content-list', {
      title: 'Kelola Konten — Admin',
      blocks: blocksResult.rows,
      sections: sectionsResult.rows,
      sectionFilter,
      success: req.query.success || null,
      error: null,
    });
  } catch (err) {
    next(err);
  }
}
async function showCreateContent(req, res, next) {
  try {
    const sectionsResult = await pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC');
    res.render('admin/content-form', {
      title: 'Tambah Konten — Admin',
      sections: sectionsResult.rows,
      block: null,
      error: null,
      preselectedSection: req.query.section || null,
    });
  } catch (err) {
    next(err);
  }
}
async function createContent(req, res, next) {
  const { section_id, judul_sub, konten, urutan } = req.body;
  const errors = validateContentBlock({ section_id, judul_sub, konten, urutan });
  if (errors.length > 0) {
    const sectionsResult = await pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC');
    return res.render('admin/content-form', {
      title: 'Tambah Konten — Admin',
      sections: sectionsResult.rows,
      block: req.body,
      error: errors[0],
      preselectedSection: null,
    });
  }
  try {
    const sanitized = sanitizeContent(konten);
    await pool.query(
      `INSERT INTO content_blocks (section_id, judul_sub, konten, urutan)
       VALUES ($1, $2, $3, $4)`,
      [parseInt(section_id, 10), judul_sub.trim(), sanitized, parseInt(urutan, 10)]
    );
    res.redirect('/admin/content?success=Konten+berhasil+ditambahkan');
  } catch (err) {
    if (err.code === '23505') {
      const sectionsResult = await pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC');
      return res.render('admin/content-form', {
        title: 'Tambah Konten — Admin',
        sections: sectionsResult.rows,
        block: req.body,
        error: 'Urutan tersebut sudah digunakan dalam section ini.',
        preselectedSection: null,
      });
    }
    next(err);
  }
}
async function showEditContent(req, res, next) {
  try {
    const [blockResult, sectionsResult] = await Promise.all([
      pool.query('SELECT * FROM content_blocks WHERE id = $1', [req.params.id]),
      pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC'),
    ]);
    if (blockResult.rows.length === 0) {
      const err = new Error('Konten tidak ditemukan.');
      err.status = 404;
      return next(err);
    }
    res.render('admin/content-form', {
      title: 'Edit Konten — Admin',
      sections: sectionsResult.rows,
      block: blockResult.rows[0],
      error: null,
      preselectedSection: null,
    });
  } catch (err) {
    next(err);
  }
}
async function updateContent(req, res, next) {
  const { section_id, judul_sub, konten, urutan } = req.body;
  const errors = validateContentBlock({ section_id, judul_sub, konten, urutan });
  if (errors.length > 0) {
    const [blockResult, sectionsResult] = await Promise.all([
      pool.query('SELECT * FROM content_blocks WHERE id = $1', [req.params.id]),
      pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC'),
    ]);
    return res.render('admin/content-form', {
      title: 'Edit Konten — Admin',
      sections: sectionsResult.rows,
      block: { ...blockResult.rows[0], ...req.body, id: req.params.id },
      error: errors[0],
      preselectedSection: null,
    });
  }
  try {
    const sanitized = sanitizeContent(konten);
    await pool.query(
      `UPDATE content_blocks
       SET section_id = $1, judul_sub = $2, konten = $3, urutan = $4, updated_at = NOW()
       WHERE id = $5`,
      [parseInt(section_id, 10), judul_sub.trim(), sanitized, parseInt(urutan, 10), req.params.id]
    );
    res.redirect('/admin/content?success=Konten+berhasil+diperbarui');
  } catch (err) {
    if (err.code === '23505') {
      const [blockResult, sectionsResult] = await Promise.all([
        pool.query('SELECT * FROM content_blocks WHERE id = $1', [req.params.id]),
        pool.query('SELECT id, judul_bagian FROM sections ORDER BY urutan ASC'),
      ]);
      return res.render('admin/content-form', {
        title: 'Edit Konten — Admin',
        sections: sectionsResult.rows,
        block: { ...blockResult.rows[0], ...req.body, id: req.params.id },
        error: 'Urutan tersebut sudah digunakan dalam section ini.',
        preselectedSection: null,
      });
    }
    next(err);
  }
}
async function deleteContent(req, res, next) {
  try {
    await pool.query('DELETE FROM content_blocks WHERE id = $1', [req.params.id]);
    res.redirect('/admin/content?success=Konten+berhasil+dihapus');
  } catch (err) {
    next(err);
  }
}
module.exports = {
  showDashboard,
  listSections,
  createSection,
  showEditSection,
  updateSection,
  deleteSection,
  listContent,
  showCreateContent,
  createContent,
  showEditContent,
  updateContent,
  deleteContent,
};