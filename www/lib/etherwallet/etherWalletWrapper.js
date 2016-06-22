/* created to allow etherwallet to be used in this Angular 2 app 

Process to create this :
1. fetch this repo : https://github.com/kvhnuke/etherwallet
2. run "npm install" to fetch node_module dependencies
3. we need "ethereumjs-util" and it's dependencies, so add this line of code :
*/
var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto'); // to get the crypto lib too
ethUtil.scrypt = require('scryptsy'); // and this one too
var Buffer = require('buffer').Buffer;
/*
4. go to the app/lib folder for this project and run "npm init" 
   so that we have a local (client code) node_modules dir
5. get this by running "npm install ethereumjs-util"
6. and then use http://browserify.org/ to get all the dependencies
   " browserify etherWalletWrapper.js -o etherWalletWrapperBrowserified.js; 
     cp etherWalletWrapperBrowserified.js /projects/angular2/MyHealthIRL/www/lib/etherwallet "

  Add a line to make ethUtil accessible in the global scope 
   (I bet there is a better way to do this - but I don't currently know it) :
*/
window.ethUtil = ethUtil;
window.Buffer = Buffer;

/* and more come up as we go along */



// Maps for number <-> hex string conversion
var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
  _byteToHex[i] = (i + 0x100).toString(16).substr(1);
  _hexToByte[_byteToHex[i]] = i;
}

// **`unparse()` - Convert UUID byte array (ala parse()) into a string**
function unparse(buf, offset) {
  var i = offset || 0, bth = _byteToHex;
  return  bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

// See https://github.com/broofa/node-uuid for API details
function v4(options, buf, offset) {
  // Deprecated - 'format' argument, as supported in v1.2
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || _rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ii++) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || unparse(rnds);
}

window.ethUtil.uuid = {};
window.ethUtil.uuid.v4 = v4;

