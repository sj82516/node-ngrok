const websocket = require("websocket-stream")
const net = require("net")
const http = require("http")
const path = require("path")
const parser = require('http-string-parser')

const config = require("../config/server");
const error = require("../util/error");
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
}).listen(config.externalPort, function () {
    console.log("netServer listen " + config.externalPort)
});
netServer.on("error", handleError);

// httpServer for ngrok client to connect
const httpServer = http.createServer((req, res) => {
    // nothing to handle here
}).listen(config.internalPort, function () {
    console.log("httpServer listen " + config.internalPort);
});

// when ngrok client initially connect to ngrok-server, 
// ngrok-server would save ngrok-client websocket stream and correspoding url-key.
function handle(stream, request) {
    stream.on("data", (rawData)=>{
        try{
            let data = JSON.parse(rawData);
            switch(data.type){
                case "client_init":
                    let registerName = urlService.register(data.message, stream)
                    stream.write(JSON.stringify({
                        type: "register_ok",
                        message: `${registerName}.${config.domainName}`
                    }))
                    break;
            }
        }catch(error){
            console.error(error)
            if(error && error.hasOwnProperty(error)){
                stream.write(JSON.stringify({
                    type: "error",
                    message: `${error[error]}`
                }))
            }
        }
    })
}

function handleError(error) {
    console.error(error)
}

const wss = websocket.createServer({
    server: httpServer
}, handle);