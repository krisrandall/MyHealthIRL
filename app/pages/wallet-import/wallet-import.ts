import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';


@Component({
	templateUrl: 'build/pages/wallet-import/wallet-import.html'
})
export class WalletImportPage {
	constructor(public nav: NavController) {

		var global = {
			HandlePopupResult : {
				Choosen : function(results) {

					alert('here are the results!');
					alert(JSON.stringify(results));
				}
			}
		}
		window.Global = global;

		window.open('http://cocreations.com.au/sicoor/api/kloudless.choose.wrapper.html', '_blank');

	}


}
