'use strict';
const sanitizeHtml = require('sanitize-html');
/**
 * Allowed HTML tags and attributes for admin-edited content
 * Permits rich text but blocks XSS vectors
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'u', 's', 'small', 'mark',
  'ul', 'ol', 'li',
  'div', 'span', 'section',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a',
  'blockquote', 'pre', 'code',
  'img',
  'badge', // bootstrap pseudo
];
const ALLOWED_ATTRIBUTES = {
  '*': ['class', 'id', 'style'],
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan', 'scope'],
};
const ALLOWED_STYLES = {
  '*': {
    'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
    'background-color': [/^#(0x)?[0-9a-f]+$/i],
    'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
    'font-weight': [/^\d+$/, /^bold$/, /^normal$/],
  },
};
/**
 * Sanitize HTML content from admin input
 * Prevents XSS while allowing rich formatting
 */
function sanitizeContent(html) {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedStyles: ALLOWED_STYLES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    // Block all javascript: URLs
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    // Prevent data URIs in hrefs
    exclusiveFilter: (frame) => {
      return (
        frame.tag === 'a' &&
        frame.attribs.href &&
        frame.attribs.href.startsWith('javascript:')
      );
    },
  });
}
/**
 * Strip ALL HTML tags, return plain text
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}
/**
 * Sanitize a plain text string (no HTML allowed)
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim().replace(/[<>]/g, '');
}
module.exports = { sanitizeContent, stripHtml, sanitizeText };
