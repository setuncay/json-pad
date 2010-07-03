JP.AboutWindow = Ext.extend(Ext.Window, {
    layout:'fit',
    width:400,
    height:300,
    closeAction:'hide',
    plain: true,
    modal: true,
    resizable: false,
    draggable: false,
    title: 'About JSONpad',
    id: 'JP_aboutWindow',
    initComponent: function() {
	var me = this;

	var text =  '<span style="font-size: 11px;">'+
	"<p>This project started by Christopher S&ouml;llinger and is a Non-Profit free software licensed with the {2}. It is open source, so feel "+
	"free to download the latest source code at {3}.<br />&nbsp;<br />"+
	"If you have any problems with this application you can contact me over different ways:</p>"+
	"<p>- Write it to {4}<br />"+
	"-&nbsp;Or you can even post an issue to {5}<br />"+
	"-&nbsp;Or just get it contact with me:<br />"+
	'&nbsp;&nbsp;<a href="#" id="mailto:zerogiven@gmail.com" class="link-to-browser">zerogiven@gmail.com</a><br />'+
	'&nbsp;&nbsp;<a href="#" id="http://www.twitter.com/JSONpad/" class="link-to-browser">http://www.twitter.com/JSONpad</a>'+
	"</p>&nbsp;<br />"+
	'<p><b>Thanks to:</b><br />'+
	'<i>Douglas Crockford</i> :: For his excellent work with JavaScript. JSlint, JSmin and JSONparse are used from his scripts.<br />&nbsp;<br />'+
	'<i>Stefan Goessner</i> :: Very good JSON2xml script. Not needed to code again ;)</p>&nbsp;<br />'+
	'<p>If you want have more informations or news about JSONpad, feel free to visit the {6} or the {7}.</p>&nbsp;<br />'+
	'</span>'+
	'<span style="font-size: 9px;">'+
	"JSONpad Version Number: {0}<br />"+
	"ExtJS Version Number: {1}<br />&nbsp;<br />"+
	'</span>';

	var jsonPadVersion = JPAir.app.getApplicationVersion();
	var extjsVersion = Ext.version;
	var licenseLink = '<a href="#" id="http://www.jsonpad.co.cc/new_bsd_license.txt" class="link-to-browser">New BSD License</a>';
	var googleCodeLink = '<a href="#" id="http://code.google.com/p/json-pad/" class="link-to-browser">Google Code</a>';
	var googleGroupsLink = '<a href="#" id="http://groups.google.com/group/jsonpad" class="link-to-browser">Google Groups</a>';
	var homepageLink = '<a href="#" id="http://www.jsonpad.co.cc/" class="link-to-browser">homepage</a>';
	var blogLink = '<a href="#" id="http://jsonpad.blogspot.com/" class="link-to-browser">blog</a>';

	var aboutHtml = String.format(text, jsonPadVersion, extjsVersion, licenseLink, googleCodeLink, googleGroupsLink, googleCodeLink, homepageLink, blogLink);

	this.items = [new Ext.Panel({
	    autoScroll: true,
	    html: '<div style="padding: 5px;">' + aboutHtml + '</div>'
	})];

	/*this.buttons = [{
	    text:'Submit',
	    handler: function(){
		var xmlData = me.xmlForm.xmlInput.getValue();
		JP.XmlWindow.Action.setJsonData( xmlData );
		JP.XmlWindow.Action.window.hide();
	    }
	},{
	    text: 'Close',
	    handler: function(){
		JP.XmlWindow.Action.window.hide();
	    }
	}];*/

	JP.AboutWindow.superclass.initComponent.call(this);

	this.addListener("afterrender", function () {
	    Ext.select("a.link-to-browser").on("click", function (e, el) {
		var href = el.id;
		openUrl(href);
		return false;
	    });
	});
    }
});

Ext.reg('jp_aboutwindow', JP.AboutWindow);