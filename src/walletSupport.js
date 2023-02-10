module.exports = [
    {
        "name": "Metamask",
        "icon": "/source/svg/metamask.svg",
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
        "icon": "/source/png/walletConnect.png",
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