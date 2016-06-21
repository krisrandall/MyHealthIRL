
import {Page, Modal, NavController} from 'ionic-angular';
import {WalletCreate} from '../wallet-create/wallet-create';
import {WalletDetail} from '../wallet-detail/wallet-detail';
import {WalletImportPage} from '../wallet-import/wallet-import';


@Page({
  templateUrl: 'build/pages/wallet-home/wallet-home.html',
})
 
export class WalletHome {
 
  private items = [];
 
  constructor(private nav: NavController) {
  }

  addItem(){
    this.nav.push(WalletCreate, { walletHome: this } ); // it calls WalletHome.saveItem
  }
 
  saveItem(item){
    this.items.push(item);
  }
 
  viewItem(item){
    this.nav.push(WalletDetail, { item });
  }

  showImportPage() {
    this.nav.push(WalletImportPage, { });
  }

}
