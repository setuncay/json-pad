function isObject( what ) {
    return (typeof what == 'object');
}

function isArray(obj) {
    if (obj.constructor.toString().indexOf("Array") == -1)
	return false;
    else
	return true;
}

function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

function getObjectType(obj) {
    var type = "";
    if ( isObject(obj) )
	type = "object";
    if ( isArray(obj) )
	type = "array";
    return type;
}

function isString(a) {
    return typeof a == 'string';
}

function openUrl (url) {
    debug.trace("--OPEN URL '" + url + "'--");
    var urlReq = new air.URLRequest(url);
    air.navigateToURL(urlReq);
}

function count (mixed_var, mode) {
    // Count the number of elements in a variable (usually an array)
    //
    // version: 909.322
    // discuss at: http://phpjs.org/functions/count
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Waldo Malqui Silva
    // +      bugfixed by: Soren Hansen
    // *     example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE');
    // *     returns 1: 6    // *     example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
    // *     returns 2: 6
    var key, cnt = 0;

    if (mixed_var === null){
	return 0;
    } else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object){
	return 1;
    }
    if (mode === 'COUNT_RECURSIVE') {
	mode = 1;
    }
    if (mode != 1) {
	mode = 0;
    }

    for (key in mixed_var){
	cnt++;
	if ( mode==1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object) ){
	    cnt += this.count(mixed_var[key], 1);
	}
    }

    return cnt;
}

function parseXml(xml) {
    var dom = null;
    var parser = null;
    if (window.DOMParser) {
	try {
	    parser = new DOMParser();
	    dom = parser.parseFromString(xml, "text/xml");
	/*alert(dom.documentElement.childNodes[0].childNodes[0].nodeName);
	    if (dom.documentElement.nodeName=="parsererror")
	    {
		alert(dom.documentElement.childNodes[0].nodeValue);
		return(null);
	    }*/
	}
	catch (e) {
	    dom = null;
	}
    }
    else if (window.ActiveXObject) {
	try {
	    dom = new ActiveXObject('Microsoft.XMLDOM');
	    dom.async = false;
	    if (!dom.loadXML(xml)) // parse error ..
		alert("1"+dom.parseError.reason + dom.parseError.srcText);
	}
	catch (e) {
	    dom = null;
	}
    }
    /*else
	alert("oops");*/
    return dom;
}

function validJsonKey(key) {
    if (key.search(/[\W]/) != -1) return false;
    if (key.search(/protected/) != -1) return false;
    if (key.search(/class/) != -1) return false;
    if (key.search(/var/) != -1) return false;

    return true;
}

var debug = {
    trace: function ( str ) {
	if ( Ext.isAir )
	{
	    air.trace( str );
	}
	else
	{

    }
    },
    dump: function ( obj, name ) {
	if ( name == "" || !name )
	    name = "NOT ENTERED";

	debug.trace("============== DUMP VON OBJECT ==============");
	debug.trace("Name: " + name);
	debug.trace("typeOf: " + typeof(obj));
	debug.trace("=============================================");
	debug.trace( debug.dumpObject ( obj, 0 ) );
    },
    dumpObject: function (arr,level) {
	var dumped_text = "";
	if(!level) level = 0;

	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=1;j<level+1;j++) level_padding += "   ";

	if(typeof(arr) == 'object') { //Array/Hashes/Objects
	    for(var item in arr) {
		var value = arr[item];

		if(typeof(value) == 'object') { //If it is an array,
		    dumped_text += level_padding + "'" + item + "':\n";
		    dumped_text += debug.dumpObject(value,level+1);
		} else {
		    dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
		}
	    }
	} else { //Stings/Chars/Numbers etc.
	    dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
    }
}

jQuery.fn.outerHTML = function() {
    return $('<div>').append( this.eq(0).clone() ).html();
};

String.prototype.toFirstUpperCase = function() {
    return this.substring(0,1).toUpperCase() + this.substring(1, this.length).toLowerCase();
}

String.prototype.repeat = function( num ) {
    return new Array( num + 1 ).join( this );
}

Array.prototype.in_array = function(needle) {
    for(var i=0; i < this.length; i++) if(this[ i] === needle) return true;
    return false;
}
