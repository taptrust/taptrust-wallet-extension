/* globals chrome */

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.data.type == "sendTransaction")
		console.log("Background script received data. Example to address: ",request.data.toAddress);
      	sendResponse({message: "Sent values to Server"});
    });
