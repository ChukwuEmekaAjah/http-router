# Http router
A lightweight HTTP router for NodeJS with a very small API.

# API
```js
    var http = require('http');
    var app = require('light-http-router'); // entry point for handling HTTP requests to the server

    var router = app.Router();
    router.handle('/people', 'get', function(req, res){
        return res.end('We are serving people');
    })

    app.Use(router);

    http.createServer(app.Serve).listen(80);

```

# Package methods and API

- Router: a function which returns an object with a handle function and a collection of handlers on the Router. You can have multiple Routers and each of them have their separate handlers objects that are finally aggregated by the app

- Use: Accepts a router as its only parameter and copies all the prospective request handlers into the app general handler

- Serve: The entry point function that takes the server IncomingMessage object and returns a ServerResponse. This function is passed in to the `http.createServer` function 


## Usage
```javascript
const routerApp = require('router');
```
### .Router()
This is the main router of the app that creates http request handles and matches it to their corresponding url paths. It returns an object of handlers and a handle property that's a function. It is used as follows:

```javascript
    const router = routerApp.Router();
    router.handle('/poeple', 'get', function(req, res){
        return res.end("How are you?");
    })
```
The `handle` method of the router object takes the url path, url method and request handler as arguments and maps them accordingly in the `handlers` collection.

## Supported url patterns
Light HTTP router supports different types of url paths such as plain string urls, regular expression paths and paths with url parameters. Examples are as follows:


```javascript
    router.handle('/poeple', 'get', function(req, res){ // plain string path
        return res.end("How are you?");
    })

    router.handle(/name.*?/, 'get', function(req, res){ // regular expression path
        return res.end("How are you?");
    })

    router.handle('/people/:personId', 'get', function(req, res){ // path with url parameters. this adds a params property into the request (http.incomingMessage) object
        console.log("request parameter is", req.params.personId)
        return res.end("How are you?");
    })

    router.handle('/people/:personId/orders/:orderId', 'get', function(req, res){ // path with url parameters. this adds a params property into the request (http.incomingMessage) object
        console.log("request parameter is personId", req.params.personId)
        console.log("request parameter is orderId", req.params.orderId)
        return res.end("How are you?");
    })
```

It also extracts query parameters from the url path and creates a query object property on the `request (http.incomingMessage)` object.

### .Use(router)
Its only argument is a router object containing all the handlers that have been assigned to specific url paths. It mounts the router handlers into the app so that the app can now be aware of all the routes created across files in different routers. It can be used as follows:

```javascript
    routerApp.use(router);
```

### .Serve(req, res)
This method is passed into and called by the created http server whenever a request is made to the server. It is the main entry point of the router and responds accordingly to requests that have been mapped to specific handlers. 

```javascript
    const http = require('http');

    http.createServer(routerApp.Serve).listen(80);

```

## Todo
- Create functionality for parsing static file requests and responding accordingly