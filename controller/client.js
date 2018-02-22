var websocket = require("websocket-stream");
var net = require("net");

function clientMain(host, internalPort, subdomainName) {
  var wsStream = websocket("ws://localhost:8000", {
    perMessageDeflate: false
  })

  wsStream.on("data", (rawData) => {
    try {
      let data = JSON.parse(String(rawData));
      if (data && data.type) {
        switch (data.type) {
          case "register_ok":
            return console.log(`You can visit on : ${data.message}`);
          case "error":
            console.error(data.message);
        }
      }
    } catch (error) {
      // this error means http request.
      if(error.message == "Unexpected token G in JSON at position 0"){
        createConnection(rawData)
      }else{
        console.error(error.message);
      }
    }
  })

  wsStream.write(JSON.stringify({
    type: "client_init",
    message: subdomainName
  }))

  function createConnection(rawData) {
    const url = "localhost"

    client = new net.Socket();
    client.connect(internalPort, url, () => {
      // parse and console
      client.write(rawData)
    })

    client.on("data", (data) => {
      // parse and console
      wsStream.write(data);
    })
  }
}

module.exports = clientMain;