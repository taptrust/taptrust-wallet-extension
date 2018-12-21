var port = chrome.runtime.connect(null, null);

var address;

chrome.runtime.sendMessage({data: {type: "GET_ACCOUNTADDRESS"}}, function(response) {
	console.log("GET_ACCOUNTADDRESS response: " + response.address);
	if(response && response.address)
		address = response.address;
	else
		address = "none";
	
	injectScript(chrome.extension.getURL('app/inpage.js'));
});

function injectScript(file) {
	try {
		const container = document.head || document.documentElement
		var scriptTag = document.createElement('script')
		scriptTag.setAttribute('async', false)
		console.log("injecting address: " + address);
		scriptTag.textContent = "window.tapTrustAddress = '" + address + "'; console.log('injected address: ' + window.tapTrustAddress);";
		container.insertBefore(scriptTag, container.children[0]);
		container.removeChild(scriptTag)
		scriptTag = document.createElement('script')
		scriptTag.setAttribute('async', false)
		scriptTag.setAttribute('src', file)
		container.insertBefore(scriptTag, container.children[0])
		container.removeChild(scriptTag)
	} catch (e) {
		console.error('TapTrust script injection failed', e)
	}
}

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
	
console.log("CONTENT SCRIPT COMPLETED");