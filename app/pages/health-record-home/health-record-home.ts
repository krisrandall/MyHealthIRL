import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DropboxService} from '../../providers/drop-box-service/drop-box-service';
import {HealthRecordView} from '../health-record-view/health-record-view';



@Component({
  templateUrl: 'build/pages/health-record-home/health-record-home.html',
})
export class MyHealthHome {
	
	private directory = '/MyHealthIRL/Health Records';
	private items = [];
	private wait_status = '';

	constructor(public nav: NavController,
				public dropbox: DropboxService,
				private zone: NgZone) 
	{

		this.fetchHealthRecords();

	}


	// humanReadableByteCount from wallet-import fails for reasons unknow when here
	// TO DO : tidy up code and put this into a global functions module (and use that in wallet-import too of course)
	humanFileSize(bytes, si) {
	    var thresh = si ? 1000 : 1024;
	    if(Math.abs(bytes) < thresh) {
	        return bytes + ' B';
	    }
	    var units = si
	        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
	        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	    var u = -1;
	    do {
	        bytes /= thresh;
	        ++u;
	    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
	    return bytes.toFixed(1)+' '+units[u];
	}


	// need to use NgZone.run in order to have the template refresh when values change
	setStatus(status) {

		this.zone.run( ()=> this.wait_status = status );

	}

	fetchHealthRecords() {

		var self = this;

		self.items = [];

		self.setStatus('Fetching MyHealth Records ...'); 

		self.dropbox.doFullDropboxInit()
		.then(()=>self.dropbox.dropboxFetchFiles(self.directory))
		.then(self.listFiles.bind(self))
		.then(function() { 
			self.setStatus('');
		})
		.catch((e)=>{
			if (e=='reauth') {
				console.log('token expired, doing full init again ...');
				self.dropbox.doFullDropboxInit()
				.then(self.fetchHealthRecords.bind(self));
			} else {
				alert('Dropbox Error\n'+e);
				console.log(e);
				self.setStatus('');
			}
		});

	}

	listFiles(fileList) {
		var self = this;
		fileList.forEach( (fileRec)=>self.items.push(fileRec) );
	}


	addNewHealthRecord() {
		/* 
		for now what this does is let the user take a picture,
		enter a name for the "record" and then upload it to dropbox
		*/
		var self = this;

		self.setStatus('Uploading file ...');


        var options = {
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            encodingType: navigator.camera.EncodingType.JPEG,
            quality:50, /* < 100 quality for faster up and downloads */
            allowEdit: false,
            saveToPhotoAlbum: false
        };
        
        navigator.camera.getPicture((data) => {

            var imgdata = "data:image/jpeg;base64," + data;

    		var fileName = prompt('Enter a name for this file');
    		if (fileName) {

	    		fileName = "/"+fileName.replace(/[^a-z0-9]/gi, ' ')+".healthRecord";

	    		self.dropbox.dropboxUploadFile(self.directory, fileName, imgdata)
	    		.then(function() {

	    			self.setStatus('Wait for Dropbox ...');
	    			setTimeout( function() {
	    				self.fetchHealthRecords.bind(self)();
	    			}, 2000); // give Dropbox a couple of seconds to refresh its index

	    		});
		
    		}

        }, (error) => {
            alert(error);
            self.setStatus('');
        }, options);



	}


	downloadHealthRecord(filePath) {

		var self = this;

		self.setStatus('Downloading file ...');

		self.dropbox.dropboxDownloadFile(filePath).then(function(imgRec) {
			
			let imgData = imgRec._body;
			self.nav.push( HealthRecordView, { "fileName": filePath, "imgData" : imgData } );

			self.setStatus('');

		});
		

	}


}
