module.exports = [
    {
        "name": "Metamask",
        "icon": "https://cryptopark.oss-ap-southeast-1.aliyuncs.com/market/2022/01/10/c0878d6879924972962ae01af6d932f9.svg",
        "supportPc": true,
        "pluginObj": "ethereum",
        "supportNetwork":[
            "Ethereum"
        ],
        "ios": {
            "schemes": "dapp://${domain}",
            "download": "https://metamask.io/download.html"
        },
        "android": {
            "schemes": "dapp://${domain}",
            "download": "https://metamask.io/download.html"
        },
        "defaultDownload": "https://metamask.io/download.html"
    },
    {
        "name": "WalletConnect",
        "icon": "https://oss.nftup.vip/market/2022/09/19/7a6ddd2a4fc94355b1b45df7291ee1fd.png",
        "supportPc": true,
        "pluginObj": "",
        "supportNetwork":[
            "Ethereum",
            "Solana"
        ],
        "ios": {
            "schemes": "",
            "download": "https://explorer.walletconnect.com/?type=wallet"
        },
        "android": {
            "schemes": "",
            "download": "https://explorer.walletconnect.com/?type=wallet"
        },
        "defaultDownload": "https://explorer.walletconnect.com/?type=wallet"
    }
]