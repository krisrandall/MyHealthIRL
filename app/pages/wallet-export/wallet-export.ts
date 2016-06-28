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

	private uploadStatus;


	constructor(private navParams: NavParams,
				public dropbox: DropboxService) 
	{

		var self = this;

		let walletItem = this.navParams.get('item');

		self.keyStoreFileContents = JSON.stringify(walletItem.walletV3);
		self.fileName = walletItem.encFileName;

		self.uploadStatus = 'Uploading...';

		self.uploadWalletFile();
	}



	uploadWalletFile() {

		var self = this;

		self.dropbox.doFullDropboxInit()
		.then(()=>self.dropbox.dropboxUploadFile(self.walletDirectory+'/', self.fileName, self.keyStoreFileContents))
		.then(()=> self.uploadStatus = 'Keystore file has been exported to your Dropbox account ('+self.walletDirectory+'/'+self.fileName+')')
		.catch((e)=>{
			if (e=='reauth') {
				self.uploadStatus = 'Token expired, must log into Dropbox again...';
				console.log('token expired, doing full init again ...');
				self.dropbox.doFullDropboxInit().then(self.uploadWalletFile.bind(self));
			} else {
				self.uploadStatus = 'Error';
				alert('Dropbox Error\n'+e);
				console.log(e);
			}
		});

	}

}
