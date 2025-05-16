/**
 * Generates a random ID
 * @returns {string} A random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Formats a date to a human-readable format
 * @param {string} dateString - The date string
 * @returns {string} A formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  // Format date based on when it is
  if (isSameDay(date, today)) {
    return 'Today';
  } else if (isSameDay(date, yesterday)) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  }
};

/**
 * Checks if two dates are the same day
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {boolean} True if the dates are the same day
 */
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Truncates a string to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} The truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Gets a color for a priority level
 * @param {string} priority - The priority level
 * @returns {string} The color variable
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'var(--color-error-500)';
    case 'medium':
      return 'var(--color-warning-500)';
    case 'low':
      return 'var(--color-success-500)';
    default:
      return 'var(--color-neutral-500)';
  }
};