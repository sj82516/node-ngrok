const crypto = require('crypto');
const serverConfig = require("../config/server");

class Url {
    constructor() {
        let Model = require("../model/url/" + (serverConfig.store || "memory"));
        this.model = new Model();
        if (!this.model || !this.model.getUrl) {
            return console.error("Url Model is not exists");
        }
    }

    getUrl(name) {
        return this.model.getUrl(name);
    }

    register(name, socket) {
        if (name) {
            // 檢查名稱是否合法
            if(!validateName(name)){
                throw Error("InvalidName");
            }

            // 檢查是否碰撞
            let existsUrl = this.getUrl(name);
            if (existsUrl) {
                throw Error("UrlsExists");
            }

            this.model.register(name, socket);
            return name;
        }

        // if user doesn't assign url name, system would try sha-1 hash string until not collided
        while(1){
            name = createHash();
            if(!this.model.getUrl(name)){
                this.model.register(name, socket);
                return name;
            }
        }
    }

    remove(name) {
        this.model.remove(name);
    }

    getUrlList(){
        return this.model.getUrlList();
    }
}

function createHash() {
    let now = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    return crypto.createHash('sha1').update(now + random).digest('hex').slice(0,10);
}

function validateName(name){
    return /^[a-zA-Z0-9]*$/.test(name);
}

module.exports = Url;