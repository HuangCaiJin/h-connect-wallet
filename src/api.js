// let Request = require("./request")
// let api = new Request()
// let chains = require("./chain")
import chains from "./chain"

let apiJson = {
    // chainlist.org
    chainDetail(chainId) {
        let chainMapping = {}
        chains.forEach(item=>{
            chainMapping[item.chainId] = item
        })
        return chainMapping[chainId]
        // return api.get(`/_next/data/8NdOx0oZIxzrYOEN-3JS_/zh/chain/${chainId}.json`)
    },

    rpclist() {
        let chainMapping = {}
        chains.forEach(item=>{
            if(item.rpc.length > 0) {
                chainMapping[item.chainId] = item.rpc[0]
            }
        })
        return chainMapping
    }


    // nftup.vue

}
export default apiJson