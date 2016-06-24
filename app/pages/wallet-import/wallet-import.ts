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


		/* TO DO : check state here - if we have a valid token then we don't need to auth ... */

		// need to clear cache here 'cause caching seems to be happening, use this plugin :
		// https://github.com/moderna/cordova-plugin-cache
		if (window.cache) {
			window.cache.clear(function() {

				var win = window.open(this.fileStorageAuthUrl, "_blank", "_location=no");
				
				win.addEventListener('loadstop', function do_loadstop(e) {

					// Start an interval
					var loop = setInterval(function() {
						// Execute JavaScript to check for the existence of a name in the
						// child browser's localStorage.
						win.executeScript(
							{
								code: "document.getElementById('access_token').value"
							},
							function(values) {

								var access_token = values[0];

								if (access_token) {

									alert('the token is ' + access_token);
									//alert('account id is ' + account_id);

									clearInterval(loop);
									win.close();

								}
							}
						);
					}, 400);
				});

				win.addEventListener('exit', function do_exit() { 

				});

			}.bind(this));
		} else {
			console.log('no cache so doing nothing !! -- this just here cause im in a hurry');
		}

	}
}
