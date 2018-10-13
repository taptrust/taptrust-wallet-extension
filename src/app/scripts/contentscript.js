/* globals chrome */

/*var port = chrome.runtime.connect();*/

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "SENDTRANSACTION")) {
    console.log("Content script received data. Example from address: " + event.data.fromAddress);
    chrome.runtime.sendMessage({type: "sendTransaction", data: event.data}, function(response) {
  		console.log("ContentScript: response from background script::", response.message);
	});
    /*port.postMessage(event.data.text);*/
  }
}, false);