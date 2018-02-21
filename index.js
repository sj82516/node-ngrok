#!/usr/bin/env node

var program = require("commander");

program
    .version("0.0.1")
    .command("<role>")
    .option("-d, --domain-name [domain-name]")
    .option("-h, --host [host]")
    .option("-e, --external-port [external-port]")
    .option("-i, --internal-port [internal-port]")
    .option("-s, --subdomain-name [subdomain-name]")
    .action((role, options) => {
        console.log(options)
        if (role == "server") {
            if (!options["domain-name"]) {
                console.error('server must set domain-name!');
                process.exit(1);
            }
            global.config = {
                domainName: options["domain-name"],
                externalPort: options["external-port"] || 80,
                internalPort: options["internal-port"] || 8080,
            }
        } else if (role == "client") {

        }
    })
    .parse(process.argv);