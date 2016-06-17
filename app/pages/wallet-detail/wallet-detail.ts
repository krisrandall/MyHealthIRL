import {Page, NavParams} from 'ionic-angular';

declare var blockies: any;

@Page({
  templateUrl: 'build/pages/wallet-detail/wallet-detail.html',
})
export class WalletDetail {

	blockies: any;

	private address;
	private icon;
	private qrdata;

	constructor(private navParams: NavParams) {

		let address = this.navParams.get('item').address.toLowerCase();
		let walletIcon = blockies.create( { 'seed': address, size: 8, scale: 16 } );

		this.address = address;
		this.icon = walletIcon.toDataURL();
		this.qrdata = address;

	}

}
