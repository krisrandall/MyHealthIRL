import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {DropboxService} from '../../providers/drop-box-service/drop-box-service';

@Component({
	 templateUrl: 'build/pages/wallet-export/wallet-export.html',
})
export class WalletExportPage {

	private keyStoreFileContents;
	private fileName;
	private walletDirectory = '/MyHealthIRL/Wallets';

	constructor(private navParams: NavParams) {

		var self = this;

		let walletItem = this.navParams.get('item');

		self.keyStoreFileContents = JSON.stringify(walletItem.walletV3);
		self.fileName = walletItem.encFileName;

	}

	

	uploadWalletFile() {


	}

}
