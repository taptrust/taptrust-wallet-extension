/* globals chrome */

var port = chrome.runtime.connect(null, null);

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "SENDTRANSACTION")) {
      chrome.runtime.sendMessage({data: event.data}, (response) => {
        console.log(response);
      });
    /*port.postMessage(event.data.text);*/
  }
}, false);