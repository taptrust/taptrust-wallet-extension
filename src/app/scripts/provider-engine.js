'use strict'

const Web3 = require('web3')
const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
import { APICall } from "./ajax";

var tapTrustResponse = null;
var isEnabled = true;
var account = null;

function CreateTapTrustProvider() {
	function processTransaction(txParams, cb) {
		var event = new CustomEvent("message", {detail: {
				type: "SENDTRANSACTION",
				params:	{
					type: "appTransaction",
					value: txParams.value ? txParams.value : 0x0,
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
	
	document.addEventListener("message", function(event) {
		console.log("received message" + JSON.stringify(event));
		if(event.detail) {
			if (event.detail.type == "SENDTRANSACTION_RESPONSE") {
				console.log(event.detail.type);
				tapTrustResponse = event.detail.data;
			}else if(event.detail.type == "TAPTRUST_USER_UPDATE") {
				console.log("setting user account info: " + event.detail.address);
				window.tapTrustAddress = event.detail.address;
				web3.eth.defaultAccount = event.detail.address;
			}
		}
	}, false);
	
	function awaitResponse(cb) {
		var pollTimes = 0;
		var request_id = null;
		var interval = setInterval(function () {
			pollTimes++;
			if(tapTrustResponse == null && pollTimes > 300) {
				cb("transaction request not confirmed within 5 minutes", null);
				alert("Cannot confirm transaction execution, transaction request not approved within 5 minutes");
				clearInterval(interval);
			}
			else if(tapTrustResponse != null) {
					clearInterval(interval);
					if(tapTrustResponse.success) {
						cb(null, tapTrustResponse.authRequest.txhash);
						alert("Transaction approved and submitted. TXHash: " + tapTrustResponse.authRequest.txhash);
						console.log("Received txhash: " + tapTrustResponse.authRequest.txhash);
					}
					else {
						alert(tapTrustResponse.error);
						cb(tapTrustResponse.error, null);
					}
					tapTrustResponse = null;
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
		if(isEnabled) {
			cb(null, [web3.eth.defaultAccount]);
		} else {
			engine.enable();
			cb(null, []);
		}
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
	
	engine.isConnected = function() {
		return true;
	}
	
	engine.isMetaMask = true;

	// start polling for blocks
	engine.start();
	
	web3.setProvider = function () {
		console.debug('TAPTRUST: cannot change provider')
	}
	
	console.log("taptrust address: " + window.tapTrustAddress);

	web3.eth.defaultAccount = window.tapTrustAddress;
	
	web3.version.getNetwork = function(cb) {
		cb(null, 3)
	}
	
	web3.eth.getCoinbase = function(cb) {
		return cb(null, address)
	}
	
	engine.send = function(payload){
		if(payload.method == "eth_accounts")
			return {jsonrpc: '2.0', id: 0, result: [web3.eth.defaultAccount]};
		else if(payload.method == "net_version")
			return {jsonrpc: '2.0', id: 0, result: 3};
		else if(payload.method == "eth_coinbase")
			return {jsonrpc: '2.0', id: 0, result: web3.eth.defaultAccount};
		console.log(payload.method);
		throw new Error('Web3ProviderEngine does not support synchronous requests.')
	}
	
	window.web3 = web3;
	window.ethereum = engine;
	
	// accommodate MetaMask's new privacy mode style login
	engine.enable = function ({ force } = {}) {
		return new Promise((resolve, reject) => {
			if(!web3.eth.defaultAccount)
				alert("This dApp is requesting connection to your wallet, please login to TapTrust to continue.");
			else if(confirm("Allow this dApp to connect to TapTrust wallet?")){
				resolve([web3.eth.defaultAccount]);			
			} else
				reject();
		})
	}
	
	return engine;
}

export {
    CreateTapTrustProvider
};