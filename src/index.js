let Connect = require("./connect")
/* 
let connect = new Connect("WalletConnect",97)
document.getElementById("enable").addEventListener("click",async () => {
    document.getElementById("switch").addEventListener("click",async () => {
        connect.switchChain(56)
    })
    let init = await connect.init()
    if(init){
        let account = await connect.enable()
        if(account) {
            console.log(connect)
            document.getElementById("address").innerHTML = account[0]
            document.getElementById("chainId").innerHTML = connect.provider.chainId
            document.getElementById("connected").innerHTML = true
            connect.provider.on("networkChanged", () => {
                console.log("networkChanged",connect)
                let chainId = parseInt(connect.provider.chainId)
                console.log("networkChanged",chainId)
                document.getElementById("chainId").innerHTML = chainId
            });
            connect.provider.on("accountsChanged", data => {
                console.log("accountsChanged",data)
                document.getElementById("address").innerHTML = data[0]
            });
            connect.provider.on("disconnect", data => {
                console.log("disconnect",data)
                document.getElementById("address").innerHTML = ""
                document.getElementById("chainId").innerHTML = ""
                document.getElementById("connected").innerHTML = false
            });
        }
    }
    
})
 */

if (window) {
    window.Connect = Connect
}

module.exports = Connect