/* globals chrome */

var background = {

	username: '',
	networkId: '',

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
};

background.init();