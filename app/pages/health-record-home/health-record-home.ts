import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DropboxService} from '../../providers/drop-box-service/drop-box-service';



@Component({
  templateUrl: 'build/pages/health-record-home/health-record-home.html',
})
export class MyHealthHome {
	
	private directory = '/MyHealthIRL/Health Records';
	private items = [];


	constructor(public nav: NavController,
				public dropbox: DropboxService) 
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


	fetchHealthRecords() {

		var self = this;

		self.dropbox.doFullDropboxInit()
		.then(()=>self.dropbox.dropboxFetchFiles(self.directory))
		.then(self.listFiles.bind(self))
		.catch((e)=>{
			if (e=='reauth') {
				console.log('token expired, doing full init again ...');
				self.dropbox.doFullDropboxInit().then(self.fetchHealthRecords.bind(self));
			} else {
				alert('Dropbox Error\n'+e);
				console.log(e);
			}
		});

	}

	listFiles(fileList) {
		var self = this;
		fileList.forEach((fileRec)=>{ self.items.push(fileRec); console.log(fileRec);} );
	}


	addNewHealthRecord() {
		alert('lets do this!!');
	}

	downloadHealthRecord(item) {
		console.log(item);
		alert('lets do this -download the file !');
	}


}
