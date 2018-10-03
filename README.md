# taptrust-wallet-extension
TapTrust Wallet Browser Extension 

###For development

* Contains the Login and Home screen
* Currently API calls are made to localhost. Also the API used is /login as /pair does not exist
* To deploy into Chrome:

1. Fork repo and run `npm install`
2. Run `npm run build`
3. In Google Chrome go to `More tools -> Extensions -> Load Unpacked`
4. The path has to be set to the `build` directory of `taptrust-wallet-extension`