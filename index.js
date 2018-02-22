#!/usr/bin/env node

// This shell script only to execute ngrok-client.
var program = require("commander");
var ngrokClient = require("./controller/client");
const {
    URL
} = require('url');

program
    .version("0.0.1", '-v, --version')
    .option("-h, --host [host]")
    .option("-i, --internal-port [internal-port]")
    .option("-s, --subdomain-name [subdomain-name]")
    .command('install [name]', 'install one or more packages')
    .parse(process.argv);

let host = "";
if (!program.host) {
    return console.log("please input your ngrok-server hostname");
} else {
    try {
        host = new URL(program.host);
        console.log(`ngrok-client would connect to ${host.host}`)
    } catch (error) {
        if(error && error.code === "ERR_INVALID_URL"){
            return console.error("host url is invalid");
        }
    }
}

if (!program.internalPort) {
    return console.log("please input your internal port to listen by -i ...");
}

console.log("ngrok-client initiate ......");
ngrokClient(host.host, program.internalPort, program.subdomainName)