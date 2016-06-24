/* 
We use a custom URL scheme to redirect back to the app after doing Dropbox auth
This requires this plugin : https://github.com/EddyVerbruggen/Custom-URL-scheme
And the code below to handle the response
*/
function handleOpenURL(url) {

    setTimeout(function() {
        
        alert("received url: " + url);
        

    }, 300);
}