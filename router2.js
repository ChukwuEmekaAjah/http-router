const router = require("./index");


const Router = router.Router();
Router.handle('/ajah', 'get', function(req, res){
    console.log(`ajah ooo ${req.url}`)
    return res.end(`ajah ooo ${req.url}`);
})

Router.handle('/chuks', 'get', function(req, res){
    console.log(`"chuks ooo", ${req.url}`)
    return res.end(`"chuks ooo", ${req.url}`);
})


Router.handle('/chuks/:meatId', 'get', function(req, res){
    console.log(`path with params ooo ${req.url}`, req.params)
    return res.end(`"path with params oo", ${req.url}`);
})


Router.handle('/chuks/meatId', 'get', function(req, res){
    console.log(`path with meatId ooo ${req.url}`)
    return res.end(`"path with meatId oo", ${req.url}`);
})

module.exports = Router;