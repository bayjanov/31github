/**
 * @param {Array} arr
 * @param {number} size
 * @return {Array}
 */
var chunk = function(arr, size) {
    let chunkStart = 0;
    let chunkEnd = size;
    let chunkNum = Math.ceil(arr.length/size)
    
    let result = [];
    
    for (let i = 0; i < (chunkNum); i++) {
        result.push(arr.slice(chunkStart, chunkEnd));
        chunkStart = chunkEnd;
        chunkEnd += size;
    }
    
    return result;
    
};
