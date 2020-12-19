const http = require("http");
const router = require("./index");
const router2 = require("./router2");


const Router = router.Router();
Router.handle('/meat', 'get', function(req, res){
    console.log(`wahala ooo ${req.url}`)
    return res.end(`wahala ooo ${req.url}`);
})

Router.handle('/people', 'get', function(req, res){
    console.log(`"people ooo", ${req.url}`)
    return res.end(`"people ooo", ${req.url}`);
});

Router.handle(/emekus/, 'get', function(req, res){
    console.log("emekus ooo");
    return res.end("emekus is here")
})

router.Use(Router);
router.Use(router2);

http.createServer(router.Serve).listen(3000)