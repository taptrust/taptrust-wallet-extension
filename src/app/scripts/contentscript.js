var port = chrome.runtime.connect(null, null);

function injectScript(file) {
	try {
		const container = document.head || document.documentElement
		const scriptTag = document.createElement('script')
		scriptTag.setAttribute('async', false)
		scriptTag.setAttribute('src', file)
		container.insertBefore(scriptTag, container.children[0])
		container.removeChild(scriptTag)
	} catch (e) {
		console.error('TapTrust script injection failed', e)
	}
}

injectScript(chrome.extension.getURL('app/inpage.js'));

document.addEventListener("message", function(event) {
	if (event.detail.type) {
		if(event.detail.type == "SENDTRANSACTION") {
			console.log(event.detail.type);
			chrome.runtime.sendMessage({data: event.detail}, (response) => {
				console.log(JSON.stringify(response));
				var event = new CustomEvent("message", {detail: {
						type: "SENDTRANSACTION_RESPONSE",
						data: response
					}});
				document.dispatchEvent(event);
			});
		} else if(event.detail.type == "GETACCOUNT_REQUESTED") {
			chrome.storage.sync.get(['account'], function(result) {
				if(result.account.address != undefined) {
					console.log("acquired user account info: " + result.account.address);
					var event = new CustomEvent("message", {detail: { type: "TAPTRUST_USER_UPDATE", address: result.account.address }});
					document.dispatchEvent(event);
				} else {
					alert("This dApp is requesting connection to your wallet, please login to TapTrust to continue.");
				}
			});
		}
	}
}, false);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.data.type == "TAPTRUST_USER_UPDATE") {
			console.log("acquired user account info: " + request.data.address);
			var event = new CustomEvent("message", {detail: { type: "TAPTRUST_USER_UPDATE", address: request.data.address }});
			document.dispatchEvent(event);
		}
	});