const util = require('util');

const superHandlers = {};

function Use(Router){
    for(let method in Router.handlers){
        superHandlers[method] = Router.handlers[method];
    }
}

function isPathWithParams(path){
    let pathWithParamsRegexp = /\/:.*?/gi;

    return pathWithParamsRegexp.test(path);
}

function removeFalsePositives(array){
    return array.filter((item) => {
        if(Boolean(item) == true){
            return true;
        }
        return false;
    })
}

function Serve(req, res){
    req.params = {}
    if(superHandlers[req.url]){
        if(req.method.toLowerCase() == superHandlers[req.url].method){
            return superHandlers[req.url].handler(req, res);
        }
    }

    for(let path in superHandlers){
        if(isPathWithParams(path)){
            let pathParts = removeFalsePositives(path.split('/'));
            let urlParts = removeFalsePositives(req.url.split('/'));
            console.log(pathParts, urlParts)

            if(pathParts.length != urlParts.length){
                continue;
            }

            // compare parts
            for(let part in pathParts){
                if(pathParts[part].indexOf(':') == 0){
                    req.params[pathParts[part].slice(1,)] = urlParts[part]
                    continue;
                }

                if(pathParts[part] != urlParts[part]){
                    break;
                }
            }

            return superHandlers[path].handler(req, res);
        }

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