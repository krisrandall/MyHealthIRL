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

		/*
		Note that we don't have a proper window object here so the postMessage back from
		kloudless cannot work - instead we need to do this hack that lets us look inside
		the child browser for the success string 
		*/
		var successString : String = "You have successfully connected your account.";
		var win = window.open(this.iframeContent, "_blank",
			 "EnableViewPortScale=no" );

		// Once the InAppBrowser finishes loading
		win.addEventListener( "loadstop", function() {

		    // Start an interval
		    var loop = setInterval(function() {

		        // Execute JavaScript to check for the existence of a name in the
		        // child browser's localStorage.
		        win.executeScript(
		            {
		                code: "((document.body.textContent || document.body.innerText).indexOf('"+successString+"') > -1)"
		            },
		            function( values ) {
		                var gotSuccess = values[ 0 ];

		                // If a name was set, clear the interval and close the InAppBrowser.
		                if ( gotSuccess ) {
		                    clearInterval( loop );

							alert('AND HERE WE ARE !!!');
							
							console.log(document.body.innerText);
							
							console.log(' ---- ');

							console.log(receiveMessage);

/*
							win.close();
							win.close();
	*/
		                }
		            }
		        );
		    }, 800);
		});


	}


}
