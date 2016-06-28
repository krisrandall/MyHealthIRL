import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {WalletDetail} from '../wallet-detail/wallet-detail';
import {WalletHome} from '../wallet-home/wallet-home';
import {DropboxService} from '../../providers/drop-box-service/drop-box-service';


declare var Wallet : any;


@Component({
  templateUrl: 'build/pages/wallet-import/wallet-import.html',
})
export class WalletImportPage {

	private items = [];
	private state = '';

	private walletDirectory = '/MyHealthIRL/Wallets';

	private walletHome;


    getBlob(mime, str) {
        var str = (typeof str === 'object') ? JSON.stringify(str) : str;
        if (str == null) return '';
        var blob = new Blob([str], {
            type: mime
        });
        return window.URL.createObjectURL(blob);        
    }

	humanReadableByteCount(bytes) {
	    var unit = 1024;
	    if (bytes < unit) return bytes + " B";
	    var exp = (Math.log(bytes) / Math.log(unit));
	    var pre = ("KMGTPE").charAt(exp-1) + ("i");
	    return String.format("%.1f %sB", bytes / Math.pow(unit, exp), pre);
	}



	constructor(private navParams: NavParams, 
				public nav: NavController,  
				public dropbox: DropboxService) 
	{

		var self = this;

		self.walletHome = self.navParams.get('walletHome');

		self.fetchDropboxWallets();
	}


	fetchDropboxWallets() {

		var self = this;

		self.dropbox.doFullDropboxInit()
		.then(()=>self.dropbox.dropboxFetchFiles(self.walletDirectory))
		.then(self.listFiles.bind(self))
		.catch((e)=>{
			if (e=='reauth') {
				console.log('token expired, doing full init again ...');
				self.dropbox.doFullDropboxInit().then(self.fetchDropboxWallets.bind(self));
			} else {
				alert('Dropbox Error\n'+e);
				console.log(e);
			}
		});

	}


	listFiles(fileList) {
		var self = this;
		fileList.forEach((fileRec)=>{ self.items.push(fileRec)});
	}


	importWallet(walletFilePath) {

		var self = this;

		self.dropbox.dropboxDownloadFile(walletFilePath)
		.then((res) => { processWallet(res) })
		.catch((e) => { if (e.status===401) { alert('Token expired, must reAuthenticate'); } else { console.error(e); } });

		function processWallet(fileData) {

			var unlockPassword = prompt('Enter the password for this keystore');

			if (unlockPassword) {

				// need to wrap inside of settimeout in order to force page refresh
				self.state = 'checkingPassphrase';
				setTimeout(function() {
					
					try {
						var wallet = Wallet.getWalletFromPrivKeyFile(fileData._body, unlockPassword);				

		            	let item = {
			                wallet: wallet,
			                address: wallet.getAddressString(),
			                blob: self.getBlob("text/json;charset=UTF-8", wallet.toJSON()),
			                blobEnc: self.getBlob("text/json;charset=UTF-8", 
			                            wallet.toV3(unlockPassword, {n: 1024})),
			                walletV3: wallet.toV3(unlockPassword, {n: 1024}),
			                createdOn: new Date(),
			                encFileName: wallet.getV3Filename(new Date())
			            };

			            self.walletHome.saveItem(item);
			            self.nav.pop();

									console.log('test!');
						//alert('i got the dam file, wat now?');
						console.log(fileData);	
						// check if exists already and if it does then alert the user
						// else import it like a normal wallet	

					} catch(e) {
						alert(e.toString());
						self.state = '';
					}

				}, 100);

			}
		
		} // processWallet

	}  // importWallet



}
