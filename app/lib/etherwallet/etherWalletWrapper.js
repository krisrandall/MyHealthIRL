/* created to allow etherwallet to be used in this Angular 2 app 

Process to create this :
1. fetch this repo : https://github.com/kvhnuke/etherwallet
2. run "npm install" to fetch node_module dependencies
3. we need "ethereumjs-util" and it's dependencies, so add this line of code :
*/
var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto'); // to get the crypto lib too
/*
4. go to the app/lib folder for this project and run "npm init" 
   so that we have a local (client code) node_modules dir
5. get this by running "npm install ethereumjs-util"
6. and then use http://browserify.org/ to get all the dependencies
   "browserify etherWalletWrapper.js -o etherWalletWrapperBrowserified.js"

  Add a line to make ethUtil accessible in the global scope 
   (I bet there is a better way to do this - but I don't currently know it) :
*/
window.ethUtil = ethUtil;

