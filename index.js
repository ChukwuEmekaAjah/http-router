const util = require('util');

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

    for(let path in superHandlers){
        if(superHandlers[path].type == 'regexp'){
            if(superHandlers[path].path.test(req.url) == true){
                return superHandlers[path].handler(req, res);
            }
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
                path: path,
                type: typeof(path) == 'string' ? 'string' : util.types.isRegExp(path) == true ? 'regexp' : null,
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