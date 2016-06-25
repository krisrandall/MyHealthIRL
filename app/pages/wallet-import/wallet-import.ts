import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

/*
  Generated class for the WalletImportPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/wallet-import/wallet-import.html',
})
export class WalletImportPage {

	private fileStorageAuthUrl;

	constructor(public nav: NavController) {

		var filesSource = {
			"dropbox": {
				"base_url": "https://www.dropbox.com/1/oauth2/authorize?response_type=token&state=whatever",
				"client_id": "7o1hlldcmb28dk5",
				"redirect_uri": "https://take5app.co/sicoor/dropbox.redirect_back_to_app.html"
			}
		}
		this.fileStorageAuthUrl = filesSource.dropbox.base_url 
								+ "&client_id=" + filesSource.dropbox.client_id 
								+ "&redirect_uri=" + filesSource.dropbox.redirect_uri;


		this.clearCache().then(this.dropboxGetToken.bind(this))
						 .then(this.dropboxListFiles.bind(this));


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

	dropboxListFiles(token) {
		alert('and, the token is :'+ token);

	}

	dropboxGetToken() {

		var self = this;

		return new Promise(function(resolve, reject) {

			var win = window.open(self.fileStorageAuthUrl, "_blank", "location=no");
			
			// For devices :
			if (win.executeScript) {
				win.addEventListener('loadstop', function do_loadstop(e) {
					self.lookForTokenInChildWindow(win, this);
				});

				win.addEventListener('exit', function do_exit() { console.log('exit event happened from token code!'); });
			} else 
			// For browser window testing :
			{	
				alert('Need to get the auth token manully for this auth flow\n(from hidden field in popup)');
				setTimeout( function() {
					var token = prompt('Auth flow needs manual intervention in this browser.\n\nEnter the token:\n');
					resolve(token);
				}, 8000 );
			}

		});

	}

	lookForTokenInChildWindow(win, promise) {
		var loop;

		// clean up the popup (and interval (set below)) after auth
		function afterAuthFunc(values) {
			var access_token = values[0];
			if (access_token) {
				clearInterval(loop);
				win.close();
				promise.resolve(access_token);
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
