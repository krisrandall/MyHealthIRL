import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';

/*
  Generated class for the WalletExportPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/wallet-export/wallet-export.html',
})
export class WalletExportPage {

	private keyStoreFileContents;

	constructor(private navParams: NavParams) {

		console.log('HERE!!', navParams);

		let keyStoreFileContents = JSON.stringify(this.navParams.get('item').walletV3);
		this.keyStoreFileContents = keyStoreFileContents;

	}

}
