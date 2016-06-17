import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';
import {Autofocus} from '../../tsLib/autofocus';


// Bring in the 3rd party etherwallet Javascript library
// From : https://github.com/ethereumjs/ethereumjs-wallet
declare function require(path: string) : any;
//require('../../lib/etherwallet/etherWalletWrapperBrowserified.js'); // defines window.ethUtil
var etherWallet = require('../../lib/etherwallet/myetherwallet.js'); 


@Page({
	templateUrl: 'build/pages/wallet-create/wallet-create.html',
})
 
export class WalletCreate {
 
    private address = "";
    private passPhrase = "";

    private walletHome;

	constructor(private navParams: NavParams, private nav: NavController) {
		this.walletHome = this.navParams.get('walletHome');
	}

    private getBlob(mime, str) {
        var str = (typeof str === 'object') ? JSON.stringify(str) : str;
        if (str == null) return '';
        var blob = new Blob([str], {
            type: mime
        });
        return window.URL.createObjectURL(blob);        
    }


    saveItem() {


        if (this.passPhrase>'') {

            // Create the Wallet !!
            var wallet = Wallet.generate(false);
            let newWalletItem = {
                wallet: wallet,
                address: wallet.getAddressString(),
                blob: this.getBlob("text/json;charset=UTF-8", wallet.toJSON()),
                blobEnc: this.getBlob("text/json;charset=UTF-8", 
                            wallet.toV3(this.passPhrase, {n: 1024}))
            };

            this.walletHome.saveItem(newWalletItem);
            this.nav.pop();

        }

    }
 
    close(){
        this.nav.pop();
    }
 
}