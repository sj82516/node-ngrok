# Nodejs-Ngrok
This is a project try to remake(mimic) ngrok implementation, including server and client.  

## Installation

## Usages
You should run `node node-ngrok server` on your remote server.  
And then run `node node-ngrok client` on your local machine.  

## How it works
In order to server local server to external world, we need a mechanism to pipe request and response.

Here is the sketch

client <--> node-ngrok server <--> node-ngrok client <--> local server.  
node-ngrok server need keep running and set wildcard dns.  
When node-ngrok client initiate, you can assign specific url name to identify or keep empty to let server randomly generate. And also node-ngrok server would establish long-live tcp-socket to node-ngrok client mapping the url name.  
Then client can send tcp/http request to the url ,node-ngrok server would pipe the request to corresponding node-ngrok server.

## Reference 
1. set wildcard DNS record in OSX. 
http://asciithoughts.com/posts/2014/02/23/setting-up-a-wildcard-dns-domain-on-mac-os-x/


## License
License under the BSD-2-Clause license.  