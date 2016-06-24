import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';


declare var Global: any;


@Component({
	templateUrl: 'build/pages/wallet-import/wallet-import.html'
})
export class WalletImportPage {

	private iframeContent;
	private defaultIFrameContent = "NOT_YET_CODED"; /* this is shown if offline OR if they close the kloudless dialog */
	private fileAccessServerChoose = "http://cocreations.com.au/sicoor/api/kloudless.choose.wrapper.html";
	private timeHasPassed = false;



	constructor(public nav: NavController) {


		// This function handles the response from the kloudless file chooser
		var global = {
			HandlePopupResult : {
				Choosen : function(results) {

					alert('here are the results!');
					alert(JSON.stringify(results));
				}
			}
		}
		window.Global = global;


		// show retry button after some time has passed
		window.setTimeout(function() {
			this.timeHasPassed = true;
		}.bind(this), 6000);


		this.openFileChooser();
	}

	openFileChooser() {

		// We need to determine if we are online or offline
		this.iframeContent = this.fileAccessServerChoose + "?force_no_cache="+Math.random(); 

	}


}
