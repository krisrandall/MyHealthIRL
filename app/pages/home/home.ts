import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(private _navController: NavController) {

    console.log("TO DO : check DB for wallets (or other state) before doing this nav to wallet home ...");
    this._navController.push(WalletHome);

  }

  /*
    pushPage(){
      this._navController.push(SomeImportedPage, { userId: "12345"});
    }
  */



}
