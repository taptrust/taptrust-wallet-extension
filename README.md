# taptrust-wallet-extension
TapTrust Wallet Browser Extension 

### For development

* To deploy into Chrome:

1. Fork repo and run `npm install`
2. Run `npm run build`
3. In Google Chrome go to `More tools -> Extensions -> Load Unpacked`
4. The path has to be set to the `dist` directory of `taptrust-wallet-extension`

Make sure you have created an account in the "TapTrust Wallet" app and use that app to approve a pairing request from the browser extension. After that, you should be able to create a transaction request. For now, you can choose "Eth Address" for your transaction receipient and put in an address, or use "0x" to use the testnet administrator address to recycle Eth for testing. 
