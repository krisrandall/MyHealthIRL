
import {Page, Modal, NavController} from 'ionic-angular';
import {WalletCreate} from '../wallet-create/wallet-create';
import {WalletDetail} from '../wallet-detail/wallet-detail';



// Bring in the 3rd party etherwallet Javascript library
// From : https://github.com/ethereumjs/ethereumjs-wallet
declare function require(path: string) : any;
//require('../../lib/etherwallet/etherWalletWrapperBrowserified.js'); // defines window.ethUtil
var etherWallet = require('../../lib/etherwallet/myetherwallet.js'); 


@Page({
  templateUrl: 'build/pages/wallet-home/wallet-home.html',
})
 
export class WalletHome {
 
  private items = [];
 
  constructor(private nav: NavController) {

    console.log(Wallet);

    var wallet = Wallet.generate(false);

    console.log(wallet.getAddressString());
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

}
