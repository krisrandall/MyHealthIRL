import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';

@Page({
	templateUrl: 'build/pages/wallet-create/wallet-create.html',
})
 
export class WalletCreate {
 
    private title = "";
    private description = "";

    private walletHome;

	constructor(private navParams: NavParams, private nav: NavController) {
		this.walletHome = this.navParams.get('walletHome');
	}

    saveItem() {

        var newItem = {
          title: this.title,
          description: this.description
        };

		this.walletHome.saveItem(newItem);
		this.nav.pop();
    }
 
    close(){
        this.nav.pop();
    }
 
}