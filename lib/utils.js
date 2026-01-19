/**
 * Utility functions for the application
 */

// Email validation regex (hoisted for performance)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Smooth scroll to a section by ID
 * @param {Event} e - Click event
 * @param {string} sectionId - Target section ID
 */
export function scrollToSection(e, sectionId) {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {string|null} - Error message or null if valid
 */
export function validateEmail(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    return 'Ingresa un email válido';
  }
  return null;
}

/**
 * Validate phone number (Chilean format)
 * @param {string} phone - Phone to validate
 * @returns {string|null} - Error message or null if valid
 */
export function validatePhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length < 8) {
    return 'Teléfono debe tener al menos 8 dígitos';
  }
  return null;
}

/**
 * Validate required field with minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} - Error message or null if valid
 */
export function validateRequired(value, minLength = 2, fieldName = 'Este campo') {
  if (!value || value.trim().length < minLength) {
    return `${fieldName} es requerido (mínimo ${minLength} caracteres)`;
  }
  return null;
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('es-CL').format(num);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Class name utility (similar to clsx)
 * @param  {...any} classes - Class names or conditional objects
 * @returns {string} - Combined class string
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
