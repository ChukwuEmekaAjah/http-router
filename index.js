function router(req, res){
    
    function handle(method, req, res){
        console.log(method, req.url);
        return res.end("Wahala ooo");
    }

    return handle(req.method, req, res);
}

module.exports = router;