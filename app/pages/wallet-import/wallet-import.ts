import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import {Data} from '../../providers/data/data';
import {WalletDetail} from '../wallet-detail/wallet-detail';
import {WalletHome} from '../wallet-home/wallet-home';

declare var Wallet : any;


@Component({
  templateUrl: 'build/pages/wallet-import/wallet-import.html',
})
export class WalletImportPage {

	private items = [];
	private state = '';

	private walletHome;


    getBlob(mime, str) {
        var str = (typeof str === 'object') ? JSON.stringify(str) : str;
        if (str == null) return '';
        var blob = new Blob([str], {
            type: mime
        });
        return window.URL.createObjectURL(blob);        
    }

	/*

	WIP Note :

	The following is really all code for a dropbox component,
	It will be moved from here into an Angular 2 component as
	an exercise after I've got it all running --- need to 
	learn how to make an Angular 2 component (or whatever they are called)

	*/
	
	private filesSource = {
		// see : https://www.dropbox.com/developers/documentation/http/documentation
		// and : https://www.dropbox.com/developers/apps/info/7o1hlldcmb28dk5
		"dropbox": {
			"auth" : {
				"base_url": "https://www.dropbox.com/1/oauth2/authorize?response_type=token&state=whatever",
				"client_id": "7o1hlldcmb28dk5",
				"redirect_uri": "https://take5app.co/sicoor/dropbox.redirect_back_to_app.html"
			},
			"api_base_url": "https://api.dropboxapi.com/2/files",
			"download_base_url": "https://content.dropboxapi.com/2/files",
			"endpoints" : {
				"create_folder" : "/create_folder",		// https://www.dropbox.com/developers/documentation/http/documentation#files-create_folder
				"list" : "/list_folder",				// https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder
				"download" : "/download"				// https://www.dropbox.com/developers/documentation/http/documentation#files-download
			}
			//"download_tunnel" : "https://take5app.co/sicoor/dropbox.file_download_tunnel.html"
		}
	}

	private dropboxAuthToken;


	constructor(private navParams: NavParams, 
				public nav: NavController, 
				private http: Http, 
				private dataService: Data) 
	{

		var self = this;

		self.walletHome = self.navParams.get('walletHome');

		// Auth Drobbox, and create necessary folder structure 
		/* MyHealthIRL uses the following folder structure :
			{dropbox}
				-MyHealthIRL
					-Wallets		
					-HealthRecords
		*/


		/* 
		TO DO :

		(1) allow click on a wallet to import it into the app
		(2) detect if wallet is already imported !

		*/

		self.dataService.getData('dropboxAuthToken').then(function(token){

			if (token==='null') token = null;
			self.dropboxAuthToken = token; 

			if (self.dropboxAuthToken) {

				console.log('HERE !!!!!!!!!!!!!');
				console.log(self.dropboxAuthToken);

				self.dropboxAuthToken = self.dropboxAuthToken.replace(/['"]+/g, ''); // strip quotes added by data store

				self.clearCache()
				.then(()=>self.dropboxFetchFiles('/MyHealthIRL/Wallets'))
				.then(self.listFiles.bind(self))
				.catch((e)=>{
					if (e=='reauth') {
						console.log('token expired, doing full init again ...');
						self.doFullDropboxInit();
					} else {
						alert('Dropbox Error\n'+e);
					}
				});

			} else {

				self.doFullDropboxInit();

			}
					
		});

	

	}


	doFullDropboxInit() {

		var self = this;
		
		// There could be much better seperation of logic in this - but this is what we get right now :

		self.clearCache()
		.then(self.dropboxGetToken.bind(self))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL'))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL/Wallets'))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL/Health Records'))
		.then(()=>self.dropboxFetchFiles('/MyHealthIRL/Wallets'))
		.then(self.listFiles.bind(self))
		.catch((e)=>{

			if (e=='reauth') {
				console.log('token expired, doing full init again ...');
				self.doFullDropboxInit();
			} else {
				alert('Dropbox Error\n'+e);
			}

		});
	
	}



	// this wrapper function means it works in-device or in-browser (without the cache plugin)
	clearCache() {
		// need to clear cache here 'cause caching seems to be happening, use this plugin :
		// https://github.com/moderna/cordova-plugin-cache
		return new Promise(function(resolve, reject) {
			if (window.cache) {
				window.cache.clear( function() {
					resolve('Cache Cleared!'); 
				});
			} else {
				console.log('window.cache not available so cache not cleared at this time.');
				resolve('window.cache not available!'); // not a 'reject', this is fine
			}
		});
	}
	

	dropboxCreateFolder(path : string) {

		var self = this;

		return new Promise(function(resolve, reject) {

			var apiCreateFolder = self.filesSource.dropbox.api_base_url +
								  self.filesSource.dropbox.endpoints.create_folder;

			var headers = new Headers();
			headers.append('Content-Type', 'application/json');
			headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);

			var body : string = JSON.stringify({ "path" : path });

			self.http
			.post(apiCreateFolder, body, { "headers": headers })
			.toPromise()
			.then((res) => { resolve(res.json()); })
			.catch((e) => { if (e.status===409) { resolve('already exists'); } else { console.error(e); reject(e._body)} });

		});

	}


	dropboxFetchFiles(path) {

		var self = this;

		return new Promise(function(resolve, reject) {
			if (path!=='/MyHealthIRL/Wallets'&&path!=='/MyHealthIRL/Health Records') {
				reject('Attempt to browse non MyHealthIRL path');
			}


			var listFilesUrl = self.filesSource.dropbox.api_base_url +
								self.filesSource.dropbox.endpoints.list;

			var headers = new Headers();
			headers.append('Content-Type', 'application/json');
			headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);

			var data : string = JSON.stringify({ 
				"path" : path,
				"recursive": false,
				"include_media_info": true,
				"include_deleted": false,
				"include_has_explicit_shared_members": true
			});


			/* 
			TO DO - make recursive to get the full list of files if it is more 
			than is returned by the first end point hit
			https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder-continue
			*/
			self.http
			.post(listFilesUrl, data, { "headers": headers })
			.toPromise()
			.then((res) => { resolve(res.json().entries) })
			.catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });


		});

	}



	dropboxGetToken() {

		var self = this;

		return new Promise(function(resolve, reject) {

			var fileStorageAuthUrl = self.filesSource.dropbox.auth.base_url 
						+ "&client_id=" + self.filesSource.dropbox.auth.client_id 
						+ "&redirect_uri=" + self.filesSource.dropbox.auth.redirect_uri;
			var win = window.open(fileStorageAuthUrl, "_blank", "location=no");
			
			// For devices :
			if (win.executeScript) {
				win.addEventListener('loadstop', function do_loadstop(e) {
					self.lookForTokenInChildWindow(win, function(token) {
						self.dataService.save('dropboxAuthToken', token);
						self.dropboxAuthToken = token;
						resolve(token);
					});
				});

				win.addEventListener('exit', function do_exit() { console.log('exit event happened from token code!'); });
			} else 
			// For browser window testing :
			{	
				// alert('Need to get the auth token manully for this auth flow\n(from hidden field in popup)');
				setTimeout( function() {
					var token = prompt('Auth flow needs manual intervention in this browser.\n\nEnter the token:\n');
					self.dataService.save('dropboxAuthToken', token);
					self.dropboxAuthToken = token;
					resolve(token);
				}, 8000 );
			}

		});

	}

	lookForTokenInChildWindow(win, callback) {
		var loop;

		// clean up the popup (and interval (set below)) after auth
		function afterAuthFunc(values) {
			var access_token = values[0];
			if (access_token) {
				clearInterval(loop);
				win.close();
				callback(access_token);
			}
		}

		// keep checking the popup window until the access_token hidden field is set
		loop = setInterval(function() {

			// Execute JavaScript to check for the existence of a name in the
			// child browser's localStorage. 
			win.executeScript(
				{
					code: "document.getElementById('access_token').value"
				},
				afterAuthFunc
			);

		}, 400);		
	}

	dropboxDownloadFile(path) {
		var self = this;

		return new Promise(function(resolve, reject) {

			var listFilesUrl = self.filesSource.dropbox.download_base_url +
								self.filesSource.dropbox.endpoints.download;

			var headers = new Headers();
			headers.append('Content-Type', ' ');
			headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);
			headers.append('Dropbox-API-Arg', '{"path": "'+path+'"}');

			self.http
			.post(listFilesUrl, "", { "headers": headers })
			.toPromise()
			.then((res) => { resolve(res) })
			.catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });

		});
	}


	/* These functions possibly belong here - not in the generic dropbox component */
	listFiles(fileList) {
		var self = this;
		fileList.forEach((fileRec)=>{ self.items.push(fileRec)});
	}
	importWallet(walletFilePath) {

		var self = this;

		self.dropboxDownloadFile(walletFilePath)
		.then((res) => { processWallet(res) })
		.catch((e) => { if (e.status===401) { alert('Token expired, must reAuthenticate'); } else { console.error(e); } });

		function processWallet(fileData) {

			var unlockPassword = prompt('Enter the password for this keystore');

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

	}
	humanReadableByteCount(bytes) {
	    var unit = 1024;
	    if (bytes < unit) return bytes + " B";
	    var exp = (Math.log(bytes) / Math.log(unit));
	    var pre = ("KMGTPE").charAt(exp-1) + ("i");
	    return String.format("%.1f %sB", bytes / Math.pow(unit, exp), pre);
	}

}
