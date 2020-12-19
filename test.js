const http = require("http");
const router = require("./index");

const Router = router.Router();
Router.use('/meat', 'get', function(req, res){
    console.log(`wahala ooo ${req.url}`)
    return res.end(`wahala ooo ${req.url}`);
})



Router.use('/people', 'get', function(req, res){
    console.log(`"people ooo", ${req.url}`)
    return res.end(`"people ooo", ${req.url}`);
})

http.createServer(router.serve).listen(3000)