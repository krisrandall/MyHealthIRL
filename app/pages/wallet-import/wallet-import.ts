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
				"redirect_uri": "https://www.dropbox.com/1/oauth2/redirect_receiver"
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
				window.location = this.fileStorageAuthUrl;
			}.call(this));			
		} else {
			console.log('No window.cache pluggin -- you must be running in the browswer, or have not installed plugins !');
			window.location = this.fileStorageAuthUrl;
		}




	}
}
