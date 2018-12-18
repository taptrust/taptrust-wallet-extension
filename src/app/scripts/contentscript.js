var port = chrome.runtime.connect(null, null);

function injectScript(file) {
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    document.head.appendChild(s);
}

chrome.storage.sync.get(['account'], function(result) {
	if(result.account.address != undefined) {
		var s = document.createElement("script");
		s.innerHTML = "window.tapTrustUser = '" + result.account.address + "';";
		document.head.appendChild(s);
		
		injectScript(chrome.extension.getURL('app/inpage.js'));
	}
});

document.addEventListener("message", function(event) {
  if (event.detail.type && (event.detail.type == "SENDTRANSACTION")) {
	  console.log(event.detail.type);
      chrome.runtime.sendMessage({data: event.detail}, (response) => {
        console.log(response);
      });
    /*port.postMessage(event.data.text);*/
  }
  
  
}, false);