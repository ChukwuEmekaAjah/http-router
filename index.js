const util = require('util');
const qs = require('querystring');
const url = require('url');
const fs = require('fs');
const path = require('path');

const superHandlers = {};
const config = {}
function Use(Utility){
    if(Utility.type === 'router'){
        for(let method in Utility.handlers){
            superHandlers[method] = Utility.handlers[method];
        }
    }

    if(Utility.type === 'static'){
        config.static = Utility.setup();
        console.log("static config is", config)
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

    // check for static file
    if(isStaticFile(req.url)){
        if(isValidStaticFile(req.url)){
            return sendFile(req.url, res);
        } else {
            return res.end(`${req.url} Not found`)
        } 
    } 

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
        type: 'router',
    }
}

function isStaticFile(url){
    console.log("extension name", path.extname(url))
    return path.extname(url);
}

function isValidStaticFile(url){
    let isValid = true;
    try{
        fs.accessSync(`${config.static}${url.split('/').join(path.sep)}`, fs.constants.R_OK)
    } catch(exc){
        console.log("file is not accessible", exc)
        return false;
    }
    
    return isValid;
}

function sendFile(url, res){
    const fileAddress = `${config.static}${url.split('/').join(path.sep)}`;

    fs.readFile(fileAddress, function(err, fileData){
        if(err){
            return res.end("Error reading file")
        }
        return res.end(fileData);
    })
}

function Static(publicFolder){
    let staticDirectory = publicFolder;
    return {
        setup: function(){
            // let folder = null;
            // const pathname = `${process.cwd()}${path.sep}${publicFolder}`
            // try{
            //     folder = fs.opendirSync(pathname);
            // } catch(exc){
            //     console.log("error opening static files folder", exc);
            // }
            return `${process.cwd()}${path.sep}${staticDirectory}`;
        },
        type: 'static',
    }
}

module.exports = {
    Router: Router,
    Serve: Serve,
    Use: Use,
    Static: Static,
}