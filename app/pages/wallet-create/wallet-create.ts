import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';
import {WalletDetail} from '../wallet-detail/wallet-detail';


declare var Wallet : any;


@Page({
	templateUrl: 'build/pages/wallet-create/wallet-create.html',
})
 
export class WalletCreate {
 
    private address = "";
    private passPhrase = "";

    private walletHome;
    private viewMode = "text";

	constructor(private navParams: NavParams, private nav: NavController) {
		this.walletHome = this.navParams.get('walletHome');
	}

    getBlob(mime, str) {
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
            let item = {
                wallet: wallet,
                address: wallet.getAddressString(),
                blob: this.getBlob("text/json;charset=UTF-8", wallet.toJSON()),
                blobEnc: this.getBlob("text/json;charset=UTF-8", 
                            wallet.toV3(this.passPhrase, {n: 1024})),
                walletV3: wallet.toV3(this.passPhrase, {n: 1024}),
                createdOn: new Date(),
                encFileName: wallet.getV3Filename(new Date())
            };

            this.walletHome.saveItem(item);
            this.nav.pop();
            /* This is desirable - but causes all kinds of problems with the back button thereafter : this.nav.push(WalletDetail, { item }); */

        }

    }

    togglePassView() {
        if (this.viewMode == 'text') {
            this.viewMode = 'password';
        } else {
            this.viewMode = 'text';
        }
    }


    close() {
        this.nav.pop();
    }
 
}