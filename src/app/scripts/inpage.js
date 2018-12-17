const providerEngine = require('./provider-engine.js');

if(window.tapTrustUser != undefined) {
	var provider = providerEngine.CreateTapTrustProvider(window.tapTrustUser);
}