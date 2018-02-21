# Nodejs-Ngrok
這是一個仿造ngrok的專案，主要提供 local server有個輕鬆可以對外展示的連線機制。

## 安裝

## 使用
You should run `node node-ngrok server` on your remote server.  
And then run `node node-ngrok client` on your local machine.  

## 運作原理
為了讓local server有個對外展示的機會，我們需要一個轉發 請求/回應的機制

大抵上架構是
client <--> node-ngrok server <--> node-ngrok client <--> local server.  

node-ngrok server 需要保持啟用，被配置 wildcard dns；
node-ngrok client 在每次初始化時會設定路由參數用以識別，並建立 tcp長連結，可自行設定或由 node-ngrok server隨機生成；
後續client對特定路由發出請求就會由 node-ngrok server透過 tcp長連結轉發給 node-ngrok client，node-ngrok client在次轉發給 local server並一路回應至 client。

## Reference 
1. set wildcard DNS record in OSX. 
http://asciithoughts.com/posts/2014/02/23/setting-up-a-wildcard-dns-domain-on-mac-os-x/


## License
License under the BSD-2-Clause license.  