import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletExportPage} from '../wallet-export/wallet-export';
import {WalletHome} from '../wallet-home/wallet-home';


declare var blockies: any;

@Page({
  templateUrl: 'build/pages/wallet-detail/wallet-detail.html',
})
export class WalletDetail {

	blockies: any;

	private address;
	private icon;
	private qrdata;
	private item;

	private walletHome;


	constructor(private navParams: NavParams, private nav: NavController) {

		this.item = this.navParams.get('item');
		this.walletHome = this.navParams.get('walletHome');

		let address = this.item.address.toLowerCase();
		let walletIcon = blockies.create( { 'seed': address, size: 8, scale: 16 } );

		this.address = address;
		this.icon = walletIcon.toDataURL();
		this.qrdata = address;

	}

	showExportPage(){
		let item = this.item;
		this.nav.push(WalletExportPage, { item });
	}

	deleteWallet() {
		if (confirm('If your wallet is not backed up somewhere else you can never get it back.\n\nAre you sure you want to delete this wallet?')) {
			this.walletHome.deleteItem(this.item);
			this.nav.pop();		
		}
	}


}
