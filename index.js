const util = require('util');
const qs = require('querystring');
const url = require('url');

const superHandlers = {};

function Use(Router){
    for(let method in Router.handlers){
        superHandlers[method] = Router.handlers[method];
    }
}

function isPathWithParams(path){
    let pathWithParamsRegexp = /(\/:.*?)+/gi;

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
    req.query = qs.parse(req.url.slice(req.url.indexOf('?')+1,));

    let pathname = url.parse(req.url).pathname
    if(superHandlers[pathname]){
        if(req.method.toLowerCase() == superHandlers[pathname].method){
            return superHandlers[pathname].handler(req, res);
        }
    }

    for(let path in superHandlers){
        if(isPathWithParams(path)){
            let pathParts = removeFalsePositives(path.split('/'));
            let urlParts = removeFalsePositives(pathname.split('/'));
            
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
            if(superHandlers[path].path.test(pathname.slice(1,)) == true){
                return superHandlers[path].handler(req, res);
            }
        }
    }
    
    return res.end(`${req.url} Not found`)
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