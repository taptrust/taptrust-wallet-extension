
import { sha256, sha224 } from '../../libraries/js-sha256'
import { phase } from '../phase'
var wallet = require('../../libraries/EthereumLib/ethereumjs-wallet');

const generateSeed = (username, timestamp) => {
    return phase + username + '-' + timestamp;
}

const generateToken = (username, timestamp) => {
    let seed = generateSeed(username, timestamp);
    let token = sha256(seed);
    return token;
};

export {
    generateToken
};
