
function isEmpty(input) {
  if (typeof input === 'object' && !Array.isArray(input)) {
    return Object.keys(input).length === 0;
  }
  
  if (Array.isArray(input)) {
    return input.length === 0;
  }
  
  return false;
}
