import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';


@Component({
  templateUrl: 'build/pages/wallet-import/wallet-import.html',
})
export class WalletImportPage {

	/*

	WIP Note :

	The following is really all code for a dropbox component,
	It will be moved from here into an Angular 2 component as
	an exercise after I've got it all running --- need to 
	learn how to make an Angular 2 component (or whatever they are called)

	*/
	
	private filesSource = {
		// see : https://www.dropbox.com/developers/documentation/http/documentation
		"dropbox": {
			"auth" : {
				"base_url": "https://www.dropbox.com/1/oauth2/authorize?response_type=token&state=whatever",
				"client_id": "7o1hlldcmb28dk5",
				"redirect_uri": "https://take5app.co/sicoor/dropbox.redirect_back_to_app.html"
			},
			"base_url": "https://api.dropboxapi.com/2/files",
			"endpoints" : {
				"create_folder" : "/create_folder",		// https://www.dropbox.com/developers/documentation/http/documentation#files-create_folder
				"list" : "/list_folder" // https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder
			}
		}
	}

	private dropboxAuthToken;


	constructor(public nav: NavController, private http: Http) {

		var self = this;

		// Auth Drobbox, and create necessary folder structure 
		/* MyHealthIRL uses the following folder structure :
			{dropbox}
				-MyHealthIRL
					-Wallets		
					-HealthRecords
		*/


		/* 
		TO DO :
		(1) implement the file list as an li list
		(2) allow click on a wallet to import it into the app

		(3) save the token in the DB 
		(4) check for token here and if we have it then just do listFiles
		(5) if listFiles returns a 401 then we should re-request the token

		(6) implement "pagination on /list_folder" (ie. end point /list_folder/continue etc )
		    https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder-continue

		*/
		this.clearCache()
		.then(self.dropboxGetToken.bind(this))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL'))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL/Wallets'))
		.then(()=>self.dropboxCreateFolder('/MyHealthIRL/Health Records'))
		.then(()=>self.dropboxListFiles('/MyHealthIRL/Wallets'))
		.catch((e)=>{

			if (e=='reauth') {
				alert('TO DO : MUST REAUTH FOR NEW TOKEN!');
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

			var apiCreateFolder = self.filesSource.dropbox.base_url +
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


	dropboxListFiles(path) {

		var self = this;

		return new Promise(function(resolve, reject) {
			if (path!=='/MyHealthIRL/Wallets'&&path!=='/MyHealthIRL/Health Records') {
				reject('Attempt to browse non MyHealthIRL path');
			}


			var listFilesUrl = self.filesSource.dropbox.base_url +
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

			self.http
			.post(listFilesUrl, data, { "headers": headers })
			.toPromise()
			.then((res) => { outputTheFiles(res.json()) })
			.catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });


			function outputTheFiles(res) {

				alert('now build a list !');
				console.log(res);

				resolve();
			}

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

}
