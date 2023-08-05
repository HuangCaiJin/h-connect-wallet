import { configureChains, createConfig, getAccount, getContract } from "@wagmi/core";
import { 
    arbitrum, arbitrumGoerli, aurora, auroraTestnet, avalanche, avalancheFuji, 
    baseGoerli, boba, bronos, bronosTestnet, bsc, bscTestnet, bxn, bxnTestnet, canto, 
    celo, celoAlfajores, celoCannoli, cronos, cronosTestnet, crossbell, 
    dfk, dogechain, edgeware, edgewareTestnet, evmos, evmosTestnet, fantom, 
    fantomTestnet, fibo, filecoin, filecoinCalibration, filecoinHyperspace, flare, 
    flareTestnet, foundry, gnosis, gnosisChiado, goerli, haqqMainnet, haqqTestedge2, hardhat, 
    harmonyOne, iotex, iotexTestnet, klaytn, lineaTestnet, localhost, mainnet, metis, 
    metisGoerli, moonbaseAlpha, moonbeam, moonriver, nexi, okc, optimism, 
    optimismGoerli, polygon, polygonMumbai, polygonZkEvm, polygonZkEvmTestnet, 
    pulsechain, pulsechainV4, scrollTestnet, sepolia, shardeumSphinx, skaleBlockBrawlers, 
    skaleCalypso, skaleCalypsoTestnet, skaleChaosTestnet, skaleCryptoBlades, skaleCryptoColosseum, 
    skaleEuropa, skaleEuropaTestnet, skaleExorde, skaleHumanProtocol, skaleNebula, skaleNebulaTestnet, 
    skaleRazor, skaleTitan, skaleTitanTestnet, songbird, songbirdTestnet, syscoin, taraxa, 
    taraxaTestnet, telos, telosTestnet, thunderTestnet, wanchain, wanchainTestnet, xdc, xdcTestnet, zhejiang, zkSync, zkSyncTestnet, zora, zoraTestnet } from "@wagmi/core/chains";
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import aacTest from "./chains_v2/aacTest";
import aac from "./chains_v2/aac"

class Provider {
	constructor({ projectId = "cc2a0f4bdcdbab4a34171a4d1486fa73" }) {
		this.projectId = projectId
		this.provider = null
		this.uri = ""
		this.account = ""
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
    
	init(rpcMap,chainId = "") {

        return new Promise(async (resolve,reject) => {
            try{
                let chains = []
                if(rpcMap instanceof Array && rpcMap.length) {
                    chains = rpcMap
                }else {
                    chains = [ bsc,bscTestnet, mainnet, goerli,aacTest,aac ]
                }
        
                let { publicClient } = configureChains(chains, [w3mProvider({ projectId:this.projectId })]);
                let wagmiConfig = createConfig({
                    autoConnect: true,
                    connectors: w3mConnectors({ chains, version: 1, projectId:this.projectId }),
                    publicClient,
                });
                let ethereumClient = new EthereumClient(wagmiConfig, chains);
                let web3Modal = new Web3Modal(
                    {
                        mobileWallets:[],
                        projectId:this.projectId
                    },
                    ethereumClient
                );
                //设置默认连接的主链
                // let defaultChain = chains.find(item => {
                //     return item.id == chainId
                // })
                // defaultChain = defaultChain ? defaultChain : chains[0]
                // web3Modal.setDefaultChain(defaultChain)
                // 设置主题
                web3Modal.setTheme({
                    themeVariables: {
                      '--w3m-z-index': '10000'
                    }
                })
                let provider = false

                // 获取提供者
                web3Modal.subscribeEvents(async (event) => {
                    let { name } = event
                    if(name == "ACCOUNT_CONNECTED") {
                        provider = await ethereumClient.wagmi.args.connectors[0].getProvider()
                        resolve({
                            provider,
                            web3Modal
                        })
                    }
                    else if(name == "WALLET_BUTTON") {
                        
                    }
                    else if(name == "ACCOUNT_DISCONNECTED") {
                        
                    }
                })
                let store = localStorage.getItem("wagmi.store")
                provider = await ethereumClient.wagmi.args.connectors[0].getProvider()
                // 自动链接已有的连接
                if(store) {
                    store = JSON.parse(store)
                    if(store.state && store.state.chains) {
                        resolve({
                            provider,
                            web3Modal
                        })
                    }else {
                        await provider.disconnect()
                        web3Modal.openModal()
                    }
                }else {
                    await provider.disconnect()
                    web3Modal.openModal()
                }

                // 没有会话断开重连
                let session = localStorage.getItem("wc@2:client:0.3//session")
                if(session) {
                    session = JSON.parse(session)
                    if(session.length == 0) {
                        await provider.disconnect()
                        web3Modal.openModal()
                    }
                }
            }catch(err){
                reject(err)
            }
        })
	}

	


}

export default Provider






