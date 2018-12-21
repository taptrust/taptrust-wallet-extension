/* globals chrome */
import { APICall } from '../popup/ajax';

window.accountAddress = null;

chrome.storage.sync.get(['account'], function (response) {
	if (response.account){
		window.accountAddress = response.account.address;
	}
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) { 
		if (request.data.type == "GET_ACCOUNTADDRESS") {
			sendResponse({address: window.accountAddress});
		}
		else if (request.data.type == "TAPTRUST_USER_UPDATE") {
			window.accountAddress = request.data.address;
			sendResponse({});
		}
	});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		let username;
		if (request.data.type == "SENDTRANSACTION") {
			chrome.storage.sync.get(['account'], function (response) {
				username = response.account.username;
				console.log("Sending transaction for user: " + username);
				const params = {
	    			"username": username,
	    			"params": request.data.params			
				}

				const url = '/api/1/auth/request';

				APICall(url, params)
				.then(function(response){
					console.log("Server response: " + JSON.stringify(response));
					let message = '';
					if(response.data.status == 200 && response.data.authRequest != null) {
						message = "A transaction has been sent to the TapTrust Wallet Mobile App."
						awaitResponse(response.data.authRequest.request_id, username, sendResponse);
					}
					else {
						sendResponse({success: false, error: "Transaction could not be sent to the TapTrust Wallet Mobile App."});
						message = "Transaction could not be sent to the TapTrust Wallet Mobile App."
					}

					const notificationParams = {
			          		type: "basic",
			          		iconUrl: chrome.runtime.getURL("../assets/img/icon48.png"),
			          		title: "TapTrust Wallet",
			          		message: message,
			          		buttons: [{ title: 'Dismiss' }],
			          		requireInteraction: true
	        			}
	        		chrome.notifications.create('transaction', notificationParams);
				})
				.catch(function(error){
					const notificationParams = {
			          		type: "basic",
			          		iconUrl: chrome.runtime.getURL("../assets/img/icon48.png"),
			          		title: "TapTrust Wallet",
			          		message: "Transaction could not be sent to the TapTrust Wallet Mobile App.",
			          		buttons: [{ title: 'Dismiss' }],
			          		requireInteraction: true
        			}
	        		chrome.notifications.create('transaction', notificationParams);
  					sendResponse({success: false, error: "Failure in sending transaction data to server"});
				})
					
			})
		}
		return true;
	}
);

function awaitResponse(request_id, username, cb) {
	var pollTimes = 0;
	var interval = setInterval(function () {
		pollTimes++;
		console.log("awaiting confirmation of request id: " + request_id);
		if(pollTimes > 60) {
			clearInterval(interval);
			cb({success: false, error: "transaction request not confirmed within 5 minutes"});
		}
		else {
			const url = '/api/1/auth/get';
			APICall(url, {"username": username, "request_id": request_id})
				.then(function(response){
					console.log("response to get: " + JSON.stringify(response));
					if(response.data.authRequest.status == "approved" && response.data.authRequest.txhash) {
						clearInterval(interval);
						cb({success: true, authRequest: response.data.authRequest});
					} else if(response.data.authRequest.status == "reject") {
						clearInterval(interval);
						cb({success: false, error: "User rejected transaction request"});
					}
				})
				.catch(function(error){
					const notificationParams = {
			          		type: "basic",
			          		iconUrl: chrome.runtime.getURL("../assets/img/icon48.png"),
			          		title: "TapTrust Wallet",
			          		message: "Could not fetch request information from API.",
			          		buttons: [{ title: 'Dismiss' }],
			          		requireInteraction: true
        			}
	        		chrome.notifications.create('transaction', notificationParams);
					console.log(error);
				})
		}
	}, 5000);
}
