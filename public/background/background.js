/* globals chrome */

var background = {
	init: function() {
		console.log("hello world")
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log("Received username ", request);
		});
	},
};

background.init();