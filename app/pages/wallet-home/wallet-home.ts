import {Component} from '@angular/core';
import {Page, Modal, NavController} from 'ionic-angular';
import {WalletCreate} from '../wallet-create/wallet-create';
import {WalletDetail} from '../wallet-detail/wallet-detail';
import {WalletImportPage} from '../wallet-import/wallet-import';
import {Data} from '../../providers/data/data';

declare var blockies: any;

@Page({
  templateUrl: 'build/pages/wallet-home/wallet-home.html',
})
 
export class WalletHome {

  private items = [];

  constructor(private nav: NavController, private dataService: Data) {

    this.dataService.getData('wallet').then((walletList) => {

      if (walletList){
        this.items = JSON.parse(walletList);

        // create icons
        for (var i = 0; i < this.items.length; i++ ) {
          this.items[i].miniIcon = this.getItemIcon(this.items[i]);
        }
      }

    });


  }

  getItemIcon(item) {
    return blockies.create({ 'seed': item.address, size: 6, scale: 1 }).toDataURL();
  }


  addNewWallet() {
    this.nav.push(WalletCreate, { walletHome: this } ); // it calls WalletHome.saveItem 
  }

  deleteItem(item) {

    var index = this.items.indexOf(item);
    if (index > -1) {
        this.items.splice(index, 1);
    }

    this.dataService.save('wallet', this.items);
  }


  saveItem(item){
    item.miniIcon = this.getItemIcon(item);
    this.items.push(item);
    this.dataService.save('wallet', this.items);
  }

  viewItem(item) {
    this.nav.push(WalletDetail, { item, walletHome: this }); // can call WalletHome.deleteItem
  }

  showImportPage() {
    this.nav.push(WalletImportPage, { walletHome: this } ); // it calls WalletHome.saveItem
  }

}
