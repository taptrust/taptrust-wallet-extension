var tapTrust = tapTrust || {};

tapTrust.sendTranscation = function(params) {
	    window.postMessage(
	    	{ 
	    		type: "SENDTRANSACTION", 
				fromAddress: params["fromAddress"],
                toAddress: params["toAddress"],
                valueOfEth: params["valueOfEth"],
                gas: params["gas"],
                gasPrice: params["gasPrice"],
                data: params["data"],
                nonce: params["nonce"],
                url: params["url"]
            }, "*");
}