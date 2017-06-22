/**
Dynamically loads language based js file from url params
**/

class LanguageJsLoader{

    constructor(){
        this.lang = this.getAllUrlParams.lang
        if(this.lang==window.undefined)
        	this.lang='hin'
    }
    load(){
    	var filename = 'src/lang/game-'+this.lang+'.js'
    	document.write("<script src='"+filename+"'><\/script>");
    }
    get getAllUrlParams() {

	  var queryString = window.location.search.slice(1);
	  var obj = {};
	  if (queryString) {
	    queryString = queryString.split('#')[0];
	    var arr = queryString.split('&');

	    for (var i=0; i<arr.length; i++) {
	      var a = arr[i].split('=');
	      var paramNum = undefined;
	      var paramName = a[0].replace(/\[\d*\]/, function(v) {
	        paramNum = v.slice(1,-1);
	        return '';
	      });

	      var paramValue = typeof(a[1])==='undefined' ? true : a[1];
	      paramName = paramName.toLowerCase();
	      paramValue = paramValue.toLowerCase();

	      if (obj[paramName]) {
	        if (typeof obj[paramName] === 'string') {
	          obj[paramName] = [obj[paramName]];
	        }
	        if (typeof paramNum === 'undefined') {
	          obj[paramName].push(paramValue);
	        }
	        else {
	          obj[paramName][paramNum] = paramValue;
	        }
	      }
	      else {
	        obj[paramName] = paramValue;
	      }
	    }
	  }
	  return obj;
	}

}

var jsLoader = new LanguageJsLoader();
jsLoader.load();