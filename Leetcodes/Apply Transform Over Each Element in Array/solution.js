var map = function(arr, fn) {
    // let number = arr.forEach((elem) => {
    //     let i = arr.indexOf(elem)
    //     fn(elem, i)
    // })
    let number = []
    for (let i = 0; i < arr.length; i++ ) {
        number.push(fn(arr[i], i))
    }
    return number
};
