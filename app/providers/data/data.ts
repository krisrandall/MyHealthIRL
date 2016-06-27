import {Storage, SqlStorage} from 'ionic-angular';
import {Injectable} from '@angular/core';
 
@Injectable()
export class Data {
 
  private storage;
  private data;
 
  constructor(){
    this.storage = new Storage(SqlStorage, {name:'myhealthirldb'});
  }
 
  getData(which) {
    return this.storage.get(which);  
  }
 
  save(which, data){
    let newData = JSON.stringify(data);
    this.storage.set(which, newData);
  }
}