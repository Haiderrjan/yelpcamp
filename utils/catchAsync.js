// function catchAsync(fn) {
//     return function(req,res,next) {
//         fn(req,res,next).catch(e => next(e))
//     }
// }


// yesterday how to do it using normal funciton


// using module export arrow function

module.exports = func => {
    return (req,res,next) => {
        func(req,res,next).catch(next)
    }
}