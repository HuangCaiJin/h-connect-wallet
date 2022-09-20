let fs = require("fs")
let Request = require("../src/request")
let api = new Request()

let getChains = () => {
    return api.get("https://chainid.network/chains.json")
}

let getChainDetail = (chainId) => {
    try{
        return api.get(`https://chainlist.org/_next/data/CrSJ7IWqsfh1-Uoywb_uc/zh/chain/${chainId}.json`)
    }catch(err){
        console.error(err)
        return false
    }
    
}

let run = async () => {
    console.warn("wait...")
    let chains = await getChains()
    let chainlist = []
    try{
        for(let i = 0;i < chains.length; i++) {
            if(chains[i].chainId) {
                let chain = await getChainDetail(chains[i].chainId)
                if(chain){
                    chainlist.push(chain.pageProps.chain)
                    console.log(chain.pageProps.chain.name)
                }
            }else{
                console.log(chains[i])
            }
        }
    }catch(err){
        console.log(err)
    }
    fs.writeFileSync("./src/chain.json",JSON.stringify(chainlist))
}

run()