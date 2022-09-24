let WalletConnectProvider = require("@walletconnect/web3-provider").default
let walletSupport = require("./walletSupport")
let api = require("./api")
let {
    WALLET_SUPPORT,
    CHAIN_SUPPORT,
    INIT_FAIL,
    REJECT_CONNECT
} = require('./error')
class Connect {

     constructor(walletSource = "Metamask",chainId) {
        this.chainId = chainId
        this.rpc = null
        this.chainDetail = null
        this.walletDetail = null
        this.provider = null
        this.walletSource = walletSource
        
        if("walletconnect" != walletSource.toLocaleLowerCase()){
            localStorage.setItem("walletconnect","")
        }
    }

    async init(rpc) {
        try{
            // 设置自定义rpc
            this.rpc = rpc

            // 判断是否支持当前需要连接的钱包
            let walletDetail = this.supportWallets().find(item => {
                return item.name.toLocaleUpperCase() == this.walletSource.toLocaleUpperCase()
            })
            if(!walletDetail) {
                console.error(WALLET_SUPPORT)
                return false
            }else{
                this.walletDetail = walletDetail
            }

            // 获取提供者
            this.provider = await this.getProvider()

            if(this.chainId) {
                this.chainDetail = await this.getChainDetail(this.chainId)
            }

            return true
        }catch(err){
            console.log(err)
            console.error(INIT_FAIL)
        }
        return false
    }

    async switchChain(chainId) {
        chainId = chainId ? chainId : this.chainId
        let chainDetail = await api.chainDetail(chainId)
        try{
            chainId = chainId ? chainId : this.chainId
            let data = [{ chainId: `0x${parseInt(chainId).toString(16)}` }];
            await this.provider.request({
              method: "wallet_switchEthereumChain",
              params: data
            });
        }catch(err) {
            let { name,rpc,explorers,nativeCurrency } = chainDetail
            let data = [
              {
                chainId: `0x${parseInt(chainId).toString(16)}`,
                chainName: name,
                rpcUrls: rpc,
                blockExplorerUrls:explorers.length ? explorers.map(item=>{
                    return item.url
                }) : [],
                nativeCurrency:nativeCurrency
              }
            ];
            await this.provider.request({
              method: "wallet_addEthereumChain",
              params: data
            });
        }
        // 重新初始化
        await this.init(this.rpc ? this.rpc : null)
    }

    async enable() {
        try{
            let accounts = await this.provider.enable()
            // 切换至目标链
            if(this.chainId != parseInt(this.provider.chainId)) {
                await this.switchChain()
            }
            return accounts
        }catch(err){
            console.error(REJECT_CONNECT)
        }
    }

    supportUniappJump(url) {
        if (window.uni_app == "uni_app") {
          window.openH5Url(url)
        } else {
          window.location.href = url
        }
    }

    replaceDomain(url) {
        return url.replace("${domain}",document.domain)
    }

    appJump() {

        let { android,ios,defaultDownload } = this.walletDetail
        let platform = this.browser()
        if (platform.ios) {
          if (ios.schemes) {
            this.supportUniappJump(this.replaceDomain(ios.schemes))
            setTimeout(() => {
                this.supportUniappJump(ios.download)
            }, 5000);
          } else {
            this.supportUniappJump(ios.download)
          }
        } else if (platform.android) {
          if (android.schemes) {
            //创建iframe
            var ifr = document.createElement("iframe");
            ifr.src = this.replaceDomain(android.schemes);
            ifr.style.display = "none"; //隐藏
            setTimeout(() => {
                try { document.body.appendChild(ifr); } catch (err) { }

                setTimeout(() => {
                    this.supportUniappJump(android.download)
                }, 5000);
                
            }, 1000);
          } else {
            this.supportUniappJump(android.download)
          }
        } else {
            this.supportUniappJump(defaultDownload)
        }
    }

    async getProvider() {
        // 判断设备类型
        let { mobile } = this.browser()
        let provider;
        let { supportPc,pluginObj,defaultDownload } = this.walletDetail
        if(mobile) {
            if(!pluginObj || pluginObj in window) {
                if(!pluginObj) {
                    provider = await this.wcProvider()
                }else {
                    provider = window[pluginObj]
                }
            }else{
                this.appJump()
            }
        }else {
            if(supportPc){
                if(!pluginObj || pluginObj in window) {
                    if(!pluginObj) {
                        provider = await this.wcProvider()
                    }else {
                        provider = window[pluginObj]
                    }
                }else{
                    window.open(defaultDownload,"_blank")
                }
            }else{
                console.error(WALLET_SUPPORT)
            }
        }
        return provider
    }

    browser() {
        var u = navigator.userAgent;
        return {
          trident: u.indexOf("Trident") > -1, //IE内核
          presto: u.indexOf("Presto") > -1, //opera内核
          webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Adr") > -1, //android终端
          iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1, //是否iPad
          webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
          weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
          qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }

    async getChainDetail(chainId) {
        try{
            let chain = await api.chainDetail(chainId)
            return chain ? {
                ...chain,
                rpcUrl:chain.rpc.length ? chain.rpc[0] : "",
                explorer:chain.explorers.length ? chain.explorers[0] : {},
                faucet:chain.faucets.length ? chain.faucets[0] : {}
            } : null
        }catch(error){
            console.log(error)
            console.error(CHAIN_SUPPORT)
        }
    }

    supportWallets() {
        return walletSupport
    }

    async wcProvider() {
        let rpc = await api.rpclist()
        let provider = new WalletConnectProvider({
            rpc:this.rpc ? this.rpc : rpc,
            chainId:this.chainId,
            qrcodeModalOptions: {
                desktopLinks: [
                'ledger',
                'tokenary',
                'wallet',
                'wallet 3',
                'secuX',
                'ambire',
                'wallet3',
                'apolloX',
                'zerion',
                'sequence',
                'punkWallet',
                'kryptoGO',
                'nft',
                'riceWallet',
                'vision',
                'keyring'
                ],
                mobileLinks: [
                "rainbow",
                "metamask",
                "argent",
                "trust",
                "imtoken",
                "pillar",
                ],
            }
        });
  
        // let accounts = await window.ethereum.enable()
        return provider
    }
}


module.exports = Connect