/**
 * @param {Promise} promise1
 * @param {Promise} promise2
 * @return {Promise}
 */
var addTwoPromises = async function(promise1, promise2) {
    const [pro1, pro2] = await Promise.all([promise1, promise2]);
    return pro1 + pro2;
};
