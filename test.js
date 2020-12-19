const http = require("http");
const router = require("./index");

http.createServer(router).listen(3000)