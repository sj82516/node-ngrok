var websocket = require("websocket-stream");
var net = require("net");
var wsStream = websocket("ws://localhost:8000", {
  perMessageDeflate: false
})

wsStream.on("data", (rawData) => {
  try {
    console.log(rawData)
    let data = JSON.parse(String(rawData));
    if (data && data.type) {
      return console.log(`You can visit on : ${data.message}`)
    }
  } catch (error) {
    console.error(error);
    createConnection(rawData)
  }
})

wsStream.write(JSON.stringify({
  type: "client_init",
  message: "123"
}))

function createConnection(rawData) {
  const url = "localhost"
  const port = 9000

  client = new net.Socket();
  client.connect(port, url, () => {
    console.log("sending request");
    client.write(rawData)
  })

  client.on("data", (data) => {
    console.log(data);
    wsStream.write(data);
  })
}