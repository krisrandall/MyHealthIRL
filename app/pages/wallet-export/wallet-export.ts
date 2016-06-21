import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {DomSanitizationService} from '@angular/platform-browser';


@Component({
	 templateUrl: 'build/pages/wallet-export/wallet-export.html',
})
export class WalletExportPage {

	private keyStoreFileContents;
	private blobEnc;
	private encFileName;


	sanitizedBlobEncUrl(){
		// this seems stupid to me, but without it Angular2 adds "unsafe:" to my blob url
		return this.sanitizer.bypassSecurityTrustUrl(this.blobEnc);
	}

	constructor(private navParams: NavParams, private sanitizer:DomSanitizationService) {
		let walletItem = this.navParams.get('item');
		let keyStoreFileContents = JSON.stringify(walletItem.walletV3);
		
		console.log(walletItem);

				
		this.keyStoreFileContents = keyStoreFileContents;
		this.encFileName = walletItem.encFileName;
		this.blobEnc = walletItem.blobEnc;

	}

}
