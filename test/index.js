function submit() {
    const fromAddress = document.getElementById('from').value;
    const toAddress = document.getElementById('to').value;
    const valueOfEth = document.getElementById('valueOfEth').value;
    const gas = document.getElementById('gas').value;
    const gasPrice = document.getElementById('gasPrice').value;
    const data = document.getElementById('data').value;
    const nonce = document.getElementById('nonce').value;
    const url = window.location.href

    params = {
        "fromAddress": fromAddress,
        "toAddress": toAddress,
        "valueOfEth": valueOfEth,
        "gas": gas,
        "gasPrice": gasPrice,
        "data": data,
        "nonce": nonce,
        "url": url,
    }

    tapTrust.sendTranscation(params);

};