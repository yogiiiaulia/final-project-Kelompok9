'use strict';
/**
 * Centralized error handler middleware
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const isDev = process.env.NODE_ENV !== 'production';
  // Log error server-side
  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ERROR ${status}:`, err.message);
    if (isDev) console.error(err.stack);
  }
  // Determine if API or page request
  const isApi = req.path.startsWith('/api/');
  if (isApi) {
    return res.status(status).json({
      success: false,
      error: status < 500 ? err.message : 'Terjadi kesalahan server. Silakan coba lagi.',
    });
  }
  const messages = {
    400: 'Permintaan tidak valid.',
    401: 'Anda perlu login untuk mengakses halaman ini.',
    403: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    404: 'Halaman yang Anda cari tidak ditemukan.',
    429: 'Terlalu banyak permintaan. Silakan tunggu sebentar.',
    500: 'Terjadi kesalahan server. Silakan coba lagi.',
  };
  res.status(status).render('error', {
    title: `Error ${status}`,
    status,
    message: err.message || messages[status] || 'Terjadi kesalahan.',
    stack: isDev ? err.stack : null,
  });
}
module.exports = errorHandler;