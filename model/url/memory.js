class Memory {
    constructor(){
        this.urlList = {}
    }

    getUrl(name){
        return this.urlList[name];
    }

    register(name, socket){
        this.urlList[name] = socket;
    }

    remove(name){
        delete this.urlList[name];
    }

    getUrlList(){
        return Object.keys(this.urlList);
    }
}

module.exports = Memory;