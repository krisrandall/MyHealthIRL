import {Page, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/wallet-detail/wallet-detail.html',
})
export class WalletDetail {

  private title;
  private description;
 
  constructor(private navParams: NavParams) {
 
    this.title = this.navParams.get('item').title;
    this.description = this.navParams.get('item').description;
 
  }

}
