const { EthereumProvider } = require("@walletconnect/ethereum-provider");
const projectId = "f0fe9db46c54ca8bd45d1a93ea25267b";


let run = async () => {
    let ethereumProvider = await EthereumProvider.init({
        projectId,
        showQrModal: true,
        qrModalOptions: { 
            themeMode: "light" 
        },
        chains: [1],
        methods: ["eth_sendTransaction", "personal_sign"],
        events: ["chainChanged", "accountsChanged"],
        metadata: {
            name: "My Dapp",
            description: "My Dapp description",
            url: "https://my-dapp.com",
            icons: ["https://my-dapp.com/logo.png"],
        },
    });
    console.log(ethereumProvider)
}

run()