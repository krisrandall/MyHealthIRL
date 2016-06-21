import {Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
 
@Injectable()
export class Data {
 
  private storage;
  private data;
 
  constructor(){
    this.storage = new Storage(SqlStorage, {name:'wallets'});
  }
 
  getData() {
    return this.storage.get('wallets');  
  }
 
  save(data){
    let newData = JSON.stringify(data);
    this.storage.set('wallets', newData);
  }
}