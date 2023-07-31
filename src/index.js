let { Connect,runWallet_v2,provider_v2 } = require("./connect")




/* setTimeout(async () => {
    let { provider } = await runWallet_v2({
        projectId:"eada44f592fe98c4211fca1d9c767c3d",
        chainId:97,
        chainMapping: {
            97:"https://bsc-testnet.publicnode.com",
            56:"https://bsc-dataseed2.bnbchain.org"
        }
    })
    // 断开连接
    // provider.disconnect()
},2000) */
if (window) {
    window.Connect = Connect
    window.runWallet_v2 = runWallet_v2
    window.provider_v2 = provider_v2
}

module.exports = {
    Connect,
    runWallet_v2,
    provider_v2
}