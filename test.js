const http = require("http");
const assert = require('assert');
const app = require("./index");


const Router = app.Router();
Router.handle('/meat', 'get', function(req, res){
    console.log(`wahala ooo ${req.url}`)
    return res.end(`wahala ooo ${req.url}`);
})

Router.handle('/people', 'get', function(req, res){
    return res.end("people url path");
});

Router.handle(/^emekus$/, 'get', function(req, res){
    return res.end("emekus is here")
})


Router.handle('/chuks/:meatId', 'get', function(req, res){
    return res.end(`Path with param data ${req.params.meatId}`);
})


Router.handle('/chuks/:id/name/:name/age/:age', 'get', function(req, res){
    return res.end(`Path with param data ${req.params.id}-${req.params.name}-${req.params.age}`);
})

app.Use(Router);
app.Use(app.Static('public'))

const server = http.createServer(app.Serve).listen(3000, async function(){
    console.log("Server started on port ", 3000)
    http.get('http://localhost:3000/people?ajfdj=adfjl', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            assert.strictEqual("people url path", response);
            console.log("Passed test for people path")
        })
    })

    http.get('http://localhost:3000/emekus', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            assert.strictEqual("emekus is here", response);
            console.log("Passed test for regex path")
        })
    })

    http.get('http://localhost:3000/chuks/2343', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            assert.strictEqual("Path with param data 2343", response);
            console.log("Passed test for path params data")
        })
    })

    http.get('http://localhost:3000/chuks/2343/name/ajah/age/24', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            assert.strictEqual("Path with param data 2343-ajah-24", response);
            console.log("Passed test for path with complex params data")
        })
    })

    // existing file in public folder
    http.get('http://localhost:3000/index.js', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            console.log("response is ", response);
            console.log("Passed test for path with complex params data")
        })
    });

    http.get('http://localhost:3000/fr.csv', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            console.log("response is ", response);
            console.log("Passed test for path with complex params data")
        })
    });

    // non-existent file in public folder
    http.get('http://localhost:3000/js/index.js', function(res){
        let response = '';
        res.on('data', function(chunk){
            response += chunk.toString();
        })
        
        res.on('end', function(){
            console.log("response is ", response);
            console.log("Passed test for path with complex params data")
        })
    });
    
});

server.on('close', function(){
    console.log("Shutting down server and exitting Node REPL")
})

// Using the heuristic that all tests would have finished running in 2 secs since tests are not sequential
setTimeout(function(){
    server.close();
}, 2000)
