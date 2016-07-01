import {Component} from '@angular/core';
import {NavParams, NavController} from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/health-record-view/health-record-view.html',
})
export class HealthRecordView {
	private imageUriData;

  	constructor(private navParams: NavParams, public nav: NavController) {

  		this.imageUriData = this.navParams.get('imgData');

  	}

}
