import {Page, NavParams, NavController} from 'ionic-angular';
import {WalletExportPage} from '../wallet-export/wallet-export';

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

	constructor(private navParams: NavParams, private nav: NavController) {

		this.item = this.navParams.get('item');

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

}
