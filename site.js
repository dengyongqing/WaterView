//nodejs简易网站搭建程序

var http = require("http"), 
    url  = require("url"), 
    path = require("path"), 
    fs   = require("fs"); 
  
http.createServer(function (req, res) { 
    var filepath = url.parse(req.url).pathname;
    var pathname = __dirname + filepath; 
    console.info(filepath);
    switch(path.extname(pathname)){ 
        case ".html": 
            res.writeHead(200, {"Content-Type": "text/html"}); 
            break; 
        case ".js": 
            res.writeHead(200, {"Content-Type": "text/javascript"}); 
            break; 
        case ".css": 
            res.writeHead(200, {"Content-Type": "text/css"}); 
            break; 
        case ".gif": 
            res.writeHead(200, {"Content-Type": "image/gif"}); 
            break; 
        case ".jpg": 
            res.writeHead(200, {"Content-Type": "image/jpeg"}); 
            break; 
        case ".png": 
            res.writeHead(200, {"Content-Type": "image/png"}); 
            break; 
        default: 
            res.writeHead(200, {"Content-Type": "application/octet-stream"}); 
    } 

    fs.readFile(pathname,function (err,data){ 
        res.end(data); 
    }); 
   /* }).listen(8080, "192.168.95.1"); */
}).listen(3000); 

console.info('简易网站程序开启');