import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {WalletHome} from '../wallet-home/wallet-home';
import {MyHealthHome} from '../health-record-home/health-record-home';
import {Data} from '../../providers/data/data';
import {DropboxService} from '../../providers/drop-box-service/drop-box-service';


@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  private hasDropboxToken = null;
  private hasSomeWallets = null;

  constructor(private nav: NavController, 
              private dataService: Data,  
              private dropbox: DropboxService) 
  {

  }

  onPageWillEnter() {

    this.dataService.getData('wallet')
    .then((walletList) => { this.hasSomeWallets = (!!walletList) });

    this.dataService.getData('dropboxAuthToken')
    .then((token) => { this.hasDropboxToken = (!!token) });

  }

  dropboxSetup() {
    this.dropbox.doFullDropboxInit()
    .then(() => this.hasDropboxToken = (<boolean> this.dropbox.dropboxAuthToken));
  }

  showWalletHome() {
    this.nav.push(WalletHome);
  }

  showHealthtHome() {
    this.nav.push(MyHealthHome);
  }



}
