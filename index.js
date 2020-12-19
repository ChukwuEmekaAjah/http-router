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
                handle : function(path, method, handler){
                    handlers[path] = {
                        method: method.toLowerCase(),
                        handler: handler,
                    }
                }
            }
        }
    }
}

const superHandlers = {};

function Use(Router){
    for(let method in Router.handlers){
        superHandlers[method] = Router.handlers[method];
    }
}

function Serve(req, res){
    if(superHandlers[req.url]){
        if(req.method.toLowerCase() == superHandlers[req.url].method){
            return superHandlers[req.url].handler(req, res);
        }
    }
    return res.end("Progress!")
}

function Router(){
    return {
        handle : function(path, method, handler){
            this.handlers[path] = {
                method: method.toLowerCase(),
                handler: handler,
            }
        },
        handlers : {},
    }
}

module.exports = {
    Router: Router,
    Serve: Serve,
    Use: Use 
}