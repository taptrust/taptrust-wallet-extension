/* globals chrome */

/*var background = {

	username: '',
	network: '',

	init: function() {
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if(request.fn in background) {
				background[request.fn](request, sender, sendResponse);
			}
		});
	},

	setUserName: function(request, sender, sendResponse) {
		this.username = request.username;
	},

	getUserName: function(request, sender, sendResponse) {
		sendResponse(this.username);
	},

	setNetwork: function(request, sender, sendResponse) {
		this.network = request.network;
	},

	getNetwork: function(request, sender, sendResponse) {
		sendResponse(this.network);
	},
};

background.init();*/

// For sendTransaction
/*chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
	chrome.pageAction.show(tabs[0].id)
});*/