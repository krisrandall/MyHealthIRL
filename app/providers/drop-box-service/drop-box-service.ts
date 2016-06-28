import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Data} from '../../providers/data/data';



@Injectable()
export class DropboxService {
  
  private filesSource = {
    // see : https://www.dropbox.com/developers/documentation/http/documentation
    // and : https://www.dropbox.com/developers/apps/info/7o1hlldcmb28dk5
    "dropbox": {
      "auth" : {
        "base_url": "https://www.dropbox.com/1/oauth2/authorize?response_type=token&state=whatever",
        "client_id": "7o1hlldcmb28dk5",
        "redirect_uri": "https://take5app.co/sicoor/dropbox.redirect_back_to_app.html"
      },
      "api" : {
        "base_url": "https://api.dropboxapi.com/2/files",
        "endpoints" : {
          "create_folder" : "/create_folder",    // https://www.dropbox.com/developers/documentation/http/documentation#files-create_folder
          "list" : "/list_folder"
        }
      },
      "content" : {
        "base_url": "https://content.dropboxapi.com/2/files",
        "endpoints" : {
          "download" : "/download",       // https://www.dropbox.com/developers/documentation/http/documentation#files-download
          "upload" : "/upload"            // https://www.dropbox.com/developers/documentation/http/documentation#files-upload
        }
      }
    }
  }

  public dropboxAuthToken;
 

  constructor(public http: Http,
              public dataService: Data)
  {

  }
 


  doFullDropboxInit() {

    var self = this;
    
    // Auth Drobbox, and create necessary folder structure 
    /* MyHealthIRL uses the following folder structure :
      {dropbox}
        -MyHealthIRL
          -Wallets    
          -HealthRecords
    */

    return new Promise(function(resolve, reject) {

      // if we already have a token then we can just resolve (calling code must have a catch 'reauth')
      self.dataService.getData('dropboxAuthToken').then(function(token){

        if (token==='null') token = null;
        self.dropboxAuthToken = token; 

        if (self.dropboxAuthToken) {
          
          self.dropboxAuthToken = self.dropboxAuthToken.replace(/['"]+/g, '');  // strip quotes added by data store
          resolve('already have token saved');

        } else {

          self.clearCache()
          .then(self.dropboxGetToken.bind(self))
          .then(()=>self.dropboxCreateFolder('/MyHealthIRL'))
          .then(()=>self.dropboxCreateFolder('/MyHealthIRL/Wallets'))
          .then(()=>self.dropboxCreateFolder('/MyHealthIRL/Health Records'))
          .then(resolve)
          .catch((e)=>{

            if (e=='reauth') {
              console.log('token expired, doing full init again ...');
              self.doFullDropboxInit();
            } else {
              alert('Dropbox Error\n'+e);
              reject(e);
            }

          });
                
        }

      });
  
    });

  }



  // this wrapper function means it works in-device or in-browser (without the cache plugin)
  clearCache() {
    // need to clear cache here 'cause caching seems to be happening, use this plugin :
    // https://github.com/moderna/cordova-plugin-cache
    return new Promise(function(resolve, reject) {
      if (window.cache) {
        window.cache.clear( function() {
          resolve('Cache Cleared!'); 
        });
      } else {
        console.log('window.cache not available so cache not cleared at this time.');
        resolve('window.cache not available!'); // not a 'reject', this is fine
      }
    });
  }
  

  dropboxCreateFolder(path : string) {

    var self = this;

    return new Promise(function(resolve, reject) {

      var apiCreateFolder = self.filesSource.dropbox.api.base_url +
                  self.filesSource.dropbox.api.endpoints.create_folder;

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);

      var body : string = JSON.stringify({ "path" : path });

      self.http
      .post(apiCreateFolder, body, { "headers": headers })
      .toPromise()
      .then((res) => { resolve(res.json()); })
      .catch((e) => { if (e.status===409) { resolve('already exists'); } else { console.error(e); reject(e._body)} });

    });

  }


  dropboxFetchFiles(path) {

    var self = this;

    return new Promise(function(resolve, reject) {
      if (path!=='/MyHealthIRL/Wallets'&&path!=='/MyHealthIRL/Health Records') {
        reject('Attempt to browse non MyHealthIRL path');
      }


      var listFilesUrl = self.filesSource.dropbox.api.base_url +
                self.filesSource.dropbox.api.endpoints.list;

      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);

      var data : string = JSON.stringify({ 
        "path" : path,
        "recursive": false,
        "include_media_info": true,
        "include_deleted": false,
        "include_has_explicit_shared_members": true
      });


      /* 
      TO DO - make recursive to get the full list of files if it is more 
      than is returned by the first end point hit
      https://www.dropbox.com/developers/documentation/http/documentation#files-list_folder-continue
      */
      self.http
      .post(listFilesUrl, data, { "headers": headers })
      .toPromise()
      .then((res) => { resolve(res.json().entries) })
      .catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });


    });

  }



  dropboxGetToken() {

    var self = this;

    return new Promise(function(resolve, reject) {

      var fileStorageAuthUrl = self.filesSource.dropbox.auth.base_url 
            + "&client_id=" + self.filesSource.dropbox.auth.client_id 
            + "&redirect_uri=" + self.filesSource.dropbox.auth.redirect_uri;
      var win = window.open(fileStorageAuthUrl, "_blank", "location=no");
      
      // For devices :
      if (win.executeScript) {
        win.addEventListener('loadstop', function do_loadstop(e) {
          self.lookForTokenInChildWindow(win, function(token) {
            self.dataService.save('dropboxAuthToken', token);
            self.dropboxAuthToken = token;
            resolve(token);
          });
        });

        win.addEventListener('exit', function do_exit() { console.log('exit event happened from token code!'); });
      } else 
      // For browser window testing :
      {  
        // alert('Need to get the auth token manully for this auth flow\n(from hidden field in popup)');
        setTimeout( function() {
          var token = prompt('Auth flow needs manual intervention in this browser.\n\nEnter the token:\n');
          self.dataService.save('dropboxAuthToken', token);
          self.dropboxAuthToken = token;
          resolve(token);
        }, 8000 );
      }

    });

  }

  lookForTokenInChildWindow(win, callback) {
    var loop;

    // clean up the popup (and interval (set below)) after auth
    function afterAuthFunc(values) {
      var access_token = values[0];
      if (access_token) {
        clearInterval(loop);
        win.close();
        callback(access_token);
      }
    }

    // keep checking the popup window until the access_token hidden field is set
    loop = setInterval(function() {

      // Execute JavaScript to check for the existence of a name in the
      // child browser's localStorage. 
      win.executeScript(
        {
          code: "document.getElementById('access_token').value"
        },
        afterAuthFunc
      );

    }, 400);    
  }


  dropboxDownloadFile(path) {
    var self = this;

    return new Promise(function(resolve, reject) {

      var dlUrl = self.filesSource.dropbox.content.base_url +
                self.filesSource.dropbox.content.endpoints.download;

      var headers = new Headers();
      headers.append('Content-Type', ' '); // this must be a blank space (null or empty string sends 'text/plain' which dropbox rejects)
      headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);
      headers.append('Dropbox-API-Arg', '{"path": "'+path+'"}');

      self.http
      .post(dlUrl, "", { "headers": headers })
      .toPromise()
      .then((res) => { resolve(res) })
      .catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });

    });
  }


  dropboxUploadFile(path, fileName, fileDataBinary) {
    var self = this;

    return new Promise(function(resolve, reject) {

      var uploadUrl = self.filesSource.dropbox.content.base_url +
                self.filesSource.dropbox.content.endpoints.upload;

      var params = {
        "path": path+fileName,
        "mode": "add",
        "autorename": false,
        "mute": false
      }

      var headers = new Headers();
      headers.append('Content-Type', 'application/octet-stream');
      headers.append('Authorization', 'Bearer '+self.dropboxAuthToken);
      headers.append('Dropbox-API-Arg', JSON.stringify(params));


      self.http
      .post(uploadUrl, fileDataBinary, { "headers": headers })
      .toPromise()
      .then((res) => { resolve(res) })
      .catch((e) => { if (e.status===401) { reject('reauth'); } else { console.error(e); reject(e._body)} });

    });
  }

}

