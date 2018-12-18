'use strict'

const Web3 = require('web3')
const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
import { APICall } from "./ajax";

function CreateTapTrustProvider(address) {
	var accounts = [address];
	
	function processTransaction(txParams, cb) {
		var event = new CustomEvent("message", {detail: {
				type: "SENDTRANSACTION",
				params:	{
					type: "appTransaction",
					value: txParams.value,
					to: txParams.to,
					data: txParams.data,
					app: window.location.hostname
				}
			}
		});
		console.log("sending event to content script");
		document.dispatchEvent(event);
		console.log("sent event to content script");
		awaitResponse(cb);
	}
	
	window.recieveTapTrustResponse = function(response) {
		window.tapTrustResponse = response;
	}
	
	function awaitResponse(request_id, cb) {
		var pollTimes = 0;
		var interval = setInterval(function () {
			pollTimes++;
			if(pollTimes > 300)
				cb("transaction request not confirmed within 5 minutes", null);
			else {
				if(window.tapTrustResponse != null) {
					if(window.tapTrustResponse.request_id == request_id) {
						const authRequest = response;
						clearInterval(interval);
						cb(authRequest.error, authRequest.txhash);
						window.tapTrustResponse = null;
					}
				}
			}
		}, 1000);
	}
	
	function processMessage(msgParams, cb) {
		cb("not implemented", null);
	}
	
	function processPersonalMessage(msgParams, cb) {
		cb("not implemented", null);
	}
	
	function processTypedMessage(msgParams, cb) {
		cb("not implemented", null);
	}
	
	function getAccounts(cb) {
		cb(null,accounts);
	}
	
	var options = {
		"processTransaction" : processTransaction,
		"processMessage" : processMessage,
		"processPersonalMessage" : processPersonalMessage,
		"processTypedMessage" : processTypedMessage,
		"getAccounts" : getAccounts
	}
	
	var engine = new ProviderEngine();
	var web3 = new Web3(engine);
	
	web3.eth.accounts[0] = address;

	// static results
	engine.addProvider(new FixtureSubprovider({
	  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
	  net_listening: true,
	  eth_hashrate: '0x00',
	  eth_mining: false,
	  eth_syncing: true,
	}))

	// cache layer
	engine.addProvider(new CacheSubprovider())

	// filters
	engine.addProvider(new FilterSubprovider())

	// pending nonce
	engine.addProvider(new NonceSubprovider())

	// vm
	engine.addProvider(new VmSubprovider())

	// id mgmt
	engine.addProvider(new HookedWalletSubprovider(options))

	// data source
	engine.addProvider(new RpcSubprovider({
	  rpcUrl: 'https://ropsten.infura.io/v3/155f5547dd0e4ab09bded202e8bcc08a',
	}))

	// network connectivity error
	engine.on('error', function(err){
	  // report connectivity errors
	  console.error(err.stack)
	})

	// start polling for blocks
	engine.start();
	
	window.web3 = web3;
	
	return engine;
}

export {
    CreateTapTrustProvider
};