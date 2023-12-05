/**
 * @return {null|boolean|number|string|Array|Object}
 */
Array.prototype.last = function() {
    let length = this.length;
    if (length > 0) {
        return this[length -1];
    }
    return -1;
};

/**
 * const arr = [1, 2, 3];
 * arr.last(); // 3
 */
