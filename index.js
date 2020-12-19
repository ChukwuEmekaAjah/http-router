function router(){
    let handlers = {}
    return {
        serve : function(req, res){
            if(handlers[req.url]){
                if(req.method.toLowerCase() == handlers[req.url].method){
                    return handlers[req.url].handler(req, res);
                }
            }
            return res.end("Progress!")
        },
        
        Router : function(){
            return {
                use : function(path, method, handler){
                    handlers[path] = {
                        method: method.toLowerCase(),
                        handler: handler,
                    }
                }
            }
        }
    }
}

module.exports = router();