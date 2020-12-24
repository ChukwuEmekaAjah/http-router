# Http router
A lightweight HTTP router for NodeJS with a very small API.

# API
```js
    var http = require('http');
    var app = require('router'); // entry point for handling HTTP requests to the server

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