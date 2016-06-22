import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
	templateUrl: 'build/pages/wallet-import/wallet-import.html',
})
export class WalletImportPage {
	constructor(public nav: NavController) {

		$(document).ready(function() {

			var explorer = window.Kloudless.explorer({
				app_id: 'XiW25w8Rchrozdp7JM2O4socjr_kDsaErEZGuvcpZDBu5me9',
				multiselect: true,
				computer: true,
				services: [
					// see the services var in https://github.com/Kloudless/file-explorer/blob/master/src/explorer/js/config.js 
					// These 4 are popular and fit tidly on the screen :
					'dropbox',
					'gdrive',
					//'box',
					'evernote',
					//'skydrive',
					//'sugarsync',
					//'sharefile',
					//'egnyte',
					'sharepoint',
					//'onedrivebiz',
					//'hubspot',
					//'salesforce',
					//'smb',
					//'cmis',
					//'alfresco',
					//'alfresco_cloud',
					//'jive',
					//'webdav',
					//'cq5',
				]
			});

			explorer.on('success', function(files) {
				alert('My files :' + JSON.stringify(files, null, 2));
			});

			explorer.choosify(document.getElementById('chooser'));

			var files = [{
				url: "https://s3-us-west-2.amazonaws.com/static-assets.kloudless.com/static/logo_white.png",
				name: "kloudless-logo.png"
			}];

			explorer.savify(document.getElementById("saver"), files);

		});

	}

	my_func() {
		window.open('https://api.kloudless.com/v0/oauth/services/alfresco?origin=https%3A%2F%2Fstatic-cdn.kloudless.com&modifiers=normal&referrer=explorer&state=64079998105&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=token&client_id=XiW25w8Rchrozdp7JM2O4socjr_kDsaErEZGuvcpZDBu5me9&request_id=64079998105&scope=alfresco',
			'_blank');
	}
}
