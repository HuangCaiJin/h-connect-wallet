import { EthereumProvider } from "@walletconnect/ethereum-provider"
import { WalletConnectModal } from '@walletconnect/modal'
import walletSupport from "./wallet"

let wallets = {
	explorerRecommendedWalletIds: [],
	explorerExcludedWalletIds: []
}
Object.keys(walletSupport).forEach(item => {
	let { mobile, desktop, id, name, injected } = walletSupport[item]
	if (injected) {
		wallets.explorerRecommendedWalletIds.push(id)
		wallets.explorerExcludedWalletIds.push(id)
	}
})

class Provider {
	constructor({ projectId = "cc2a0f4bdcdbab4a34171a4d1486fa73" }) {
		this.projectId = projectId
		this.provider = null
		this.uri = ""
		this.account = ""
	}

	async init(rpcMap,chainId = "") {
        let chains = Object.keys(rpcMap)
        if(chainId) {
            chains = chains.filter(item => {
                return item != chainId
            })
            chains.unshift(chainId)
        }
        
        let params = {
			projectId: this.projectId,
			chains,
			showQrModal: true,
			rpcMap,
			methods: [
                "eth_sendTransaction", 
                "personal_sign",
                "eth_accounts",
                "eth_requestAccounts",
                "eth_call",
                "eth_getBalance",
                "eth_sendRawTransaction",
                "eth_sign",
                "eth_signTransaction",
                "eth_signTypedData",
                "eth_signTypedData_v3",
                "eth_signTypedData_v4",
                "wallet_switchEthereumChain",
                "wallet_addEthereumChain",
                "wallet_getPermissions",
                "wallet_requestPermissions",
                "wallet_registerOnboarding",
                "wallet_watchAsset",
                "wallet_scanQRCode"
            ],
			events: [
                "chainChanged", 
                "accountsChanged",
                "message",
                "disconnect",
                "connect"
            ],
			qrModalOptions: {
				themeMode: "light",
				...wallets,
				// enableAuthMode:true,
				// enableExplorer:true
			}
		}

		const provider = await EthereumProvider.init(params);
		this.provider = provider
		return provider
	}

	enable() {
		return new Promise((resolve, reject) => {
			try {
				this.init().then(() => {
					this.provider.on("display_uri", (uri) => {
						this.uri = uri
						if (this.uri && this.account) {
							resolve(this.provider.accounts)
						}
					});
					this.provider.on("connect", () => {
						this.account = this.provider.accounts[0]
						if (this.uri && this.account) {
							resolve(this.provider.accounts)
						}
					});
					this.provider.connect()
				})
			} catch (err) {
				console.log(err)
				reject(err)
			}
		})
	}


}

export {
	EthereumProvider,
	Provider
}
