import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';

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

    saveItem() {

        // Create the Wallet !!

        if (this.passPhrase>'') {

            let newItem = {
                address: "this.address"
            };

            this.walletHome.saveItem(newItem);
            this.nav.pop();   

        }

    }
 
    close(){
        this.nav.pop();
    }
 
}