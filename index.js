// index.js
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Frontend error captured:", message, error);
};