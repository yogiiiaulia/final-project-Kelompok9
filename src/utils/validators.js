'use strict';
/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
/**
 * Validate that a value is not empty
 */
function isNotEmpty(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}
/**
 * Validate minimum string length
 */
function hasMinLength(value, min) {
  return String(value).trim().length >= min;
}
/**
 * Validate that a value is a positive integer
 */
function isPositiveInteger(value) {
  const n = parseInt(value, 10);
  return !isNaN(n) && n > 0;
}
/**
 * Validate role
 */
function isValidRole(role) {
  return ['admin', 'pembelajar'].includes(role);
}
/**
 * Validate section form data
 */
function validateSection(data) {
  const errors = [];
  if (!isNotEmpty(data.judul_bagian)) {
    errors.push('Judul bagian tidak boleh kosong.');
  }
  if (data.judul_bagian && !hasMinLength(data.judul_bagian, 3)) {
    errors.push('Judul bagian minimal 3 karakter.');
  }
  if (!isPositiveInteger(data.urutan)) {
    errors.push('Urutan harus berupa angka positif.');
  }
  return errors;
}
/**
 * Validate content block form data
 */
function validateContentBlock(data) {
  const errors = [];
  if (!isNotEmpty(data.judul_sub)) {
    errors.push('Judul sub tidak boleh kosong.');
  }
  if (!isNotEmpty(data.konten)) {
    errors.push('Konten tidak boleh kosong.');
  }
  if (!isPositiveInteger(data.section_id)) {
    errors.push('Section ID tidak valid.');
  }
  if (!isPositiveInteger(data.urutan)) {
    errors.push('Urutan harus berupa angka positif.');
  }
  return errors;
}
/**
 * Validate login form data
 */
function validateLogin(data) {
  const errors = [];
  if (!isNotEmpty(data.email)) {
    errors.push('Email tidak boleh kosong.');
  } else if (!isValidEmail(data.email)) {
    errors.push('Format email tidak valid.');
  }
  if (!isNotEmpty(data.password)) {
    errors.push('Password tidak boleh kosong.');
  }
  return errors;
}
/**
 * Validate chat message
 */
function validateChatMessage(data) {
  const errors = [];
  if (!isNotEmpty(data.message)) {
    errors.push('Pesan tidak boleh kosong.');
  }
  if (data.message && String(data.message).trim().length > 2000) {
    errors.push('Pesan terlalu panjang. Maksimal 2000 karakter.');
  }
  return errors;
}
module.exports = {
  isValidEmail,
  isNotEmpty,
  hasMinLength,
  isPositiveInteger,
  isValidRole,
  validateSection,
  validateContentBlock,
  validateLogin,
  validateChatMessage,
};