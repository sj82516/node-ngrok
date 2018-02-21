const websocket = require("websocket-stream")
const net = require("net")
const http = require("http")
const path = require("path")
const parser = require('http-string-parser')

let urlService = require("../service/url");
urlService = new urlService();

// expose to global client to pass tcp request
const netServer = net.createServer(function (socket) {
    // pipe to ngrok client by websocket stream
    socket.on("data", (rawData) => {
        let request = parser.parseRequest(String(rawData));
        let host = request.headers["Host"] || request.headers["host"]

        let url = host.split(".")[0];
        let stream = urlService.getUrl(url);

        if (!stream) {
            socket.write("HTTP/1.1 404 Not Found \r\n\r\n");
            return socket.end();
        }

        stream.write(rawData);

        // socket.pipe(stream).on("error", handleError);
        stream.pipe(socket).on("error", handleError);
    })
    
}).listen(80, function () {
    console.log("netServer listen 80")
});
netServer.on("error", handleError);

// httpServer for ngrok client to connect
const httpServer = http.createServer((req, res) => {
    // nothing to handle here
}).listen(8000, function () {
    console.log("httpServer listen 8000");
});

// when ngrok client initially connect to ngrok-server, 
// ngrok-server would save ngrok-client websocket stream and correspoding url-key.
function handle(stream, request) {
    console.log("stream connect");
    stream.on("data", (rawData)=>{
        try{
            let data = JSON.parse(rawData);
            switch(data.type){
                case "client_init":
                    let registerName = urlService.register(data.message, stream)
                    stream.write(JSON.stringify({
                        type: "register_ok",
                        message: registerName
                    }))
                    break;
            }
        }catch(error){
            console.error(error)
        }
    })
}

function handleError(error) {
    console.error(error)
}

const wss = websocket.createServer({
    server: httpServer
}, handle);