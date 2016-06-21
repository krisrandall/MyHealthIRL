import {Component} from '@angular/core';
import {Page, Modal, NavController} from 'ionic-angular';
import {WalletCreate} from '../wallet-create/wallet-create';
import {WalletDetail} from '../wallet-detail/wallet-detail';
import {WalletImportPage} from '../wallet-import/wallet-import';
import {Data} from '../../providers/data/data';


@Page({
  templateUrl: 'build/pages/wallet-home/wallet-home.html',
})
 
export class WalletHome {

  private items = [];

  constructor(private nav: NavController, private dataService: Data) {

    this.dataService.getData().then((todos) => {

      if (todos){
        this.items = JSON.parse(todos); 
      }

    });

  }


  addItem(){
    this.nav.push(WalletCreate, { walletHome: this } ); // it calls WalletHome.saveItem
  }

  saveItem(item){
    this.items.push(item);
    this.dataService.save(this.items);
  }

  viewItem(item) {
    this.nav.push(WalletDetail, { item });
  }

  showImportPage() {
    this.nav.push(WalletImportPage, { });
  }

}
