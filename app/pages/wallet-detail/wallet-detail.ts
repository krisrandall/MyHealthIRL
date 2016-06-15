import {Page, NavParams} from 'ionic-angular';

declare var blockies: any;

@Page({
  templateUrl: 'build/pages/wallet-detail/wallet-detail.html',
})
export class WalletDetail {

	blockies: any;

	private title;
	private description;
	private icon;
	private qrcode;

	constructor(private navParams: NavParams) {

		let address = this.navParams.get('item').title.toLowerCase();

		let walletIcon = blockies.create( { 'seed': address, size: 8, scale: 16 } );

		console.log(walletIcon);

		this.title = address;
		this.description = this.navParams.get('item').description;

		this.icon = walletIcon.toDataURL();
		this.qrcode = '';

	}

}
