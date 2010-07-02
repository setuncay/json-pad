var UpdateApplication = {
    appUpdater: new runtime.air.update.ApplicationUpdaterUI(),

    configXml: "app:/update-config.xml",

    getApplicationInfo: function () {
	var xmlString = air.NativeApplication.nativeApplication.applicationDescriptor;
	var appXml = new DOMParser();
	var xmlObject = appXml.parseFromString(xmlString, "text/xml");
	var root = xmlObject.getElementsByTagName('application')[0];
	var initialWindow = root.getElementsByTagName('initialWindow')[0];

	return [root.getElementsByTagName("version")[0].firstChild.data, root.getElementsByTagName("name")[0].firstChild.data, initialWindow.getElementsByTagName("content")[0].firstChild.data];
    },

    getApplicationVersion: function () {
	return this.getApplicationInfo()[0];
    },

    getApplicationName: function () {
	return this.getApplicationInfo()[1];
    },

    checkUpdate: function () {
	UpdateApplication.appUpdater.checkNow();
    },

    onInitialization: function () {
	UpdateApplication.checkUpdate();
    },

    onError: function ( event ) {
	alert(event.toString());
    }
}

var airApplicationExit = function () {
    var exitingEvent = new air.Event(air.Event.EXITING, false, true);
    air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent);
    if (!exitingEvent.isDefaultPrevented()) {
	air.NativeApplication.nativeApplication.exit();
    }
};

var JSONpadAir = {
    prefsFile: null,
    prefsXML: null,
    stream: null,

    settings: null,

    init: function () {
	if (!air) return;

	window.nativeWindow.addEventListener(air.Event.CLOSING, JSONpadAir.windowClosingHandler);
	air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING,
	    function(e) {
		var opened = air.NativeApplication.nativeApplication.openedWindows;
		for (var i = 0; i < opened.length; i ++) {
		    opened[i].close();
		}
	    });


	this.prefsFile = air.File.applicationStorageDirectory;
	this.prefsFile = this.prefsFile.resolvePath("settings.xml");
	this.readXML();

	UpdateApplication.appUpdater.configurationFile = new air.File( UpdateApplication.configXml );
	UpdateApplication.appUpdater.addEventListener(air.ErrorEvent.ERROR, UpdateApplication.onError);
	UpdateApplication.appUpdater.addEventListener("initialized", UpdateApplication.onInitialization);
	UpdateApplication.appUpdater.initialize();
    },
    readXML: function () {
	this.stream = new air.FileStream();
	if (this.prefsFile.exists) {
	    this.stream.open(this.prefsFile, air.FileMode.READ);
	    this.processXMLData();
	}
	else
	{
	    this.saveData(null);
	}
	window.nativeWindow.visible = true;
    },
    processXMLData: function () {
	this.prefsXML = this.stream.readUTFBytes(this.stream.bytesAvailable);
	this.stream.close();
	var domParser = new DOMParser();
	this.prefsXML = domParser.parseFromString(this.prefsXML, "text/xml");

	var syntaxHl = this.prefsXML.getElementsByTagName("syntaxHighlighting")[0];

	this.settings = {
	    syntax_hl: syntaxHl.getAttribute("showCodeMirror")
	};
    },
    saveData: function (data) {
	this.createXMLData(data);
	this.writeXMLData();
    },
    createXMLData: function (data) {
	if (data == null)
	    data = {
		syntax_hl: true
	    };

	var cr = air.File.lineEnding;
	this.prefsXML =   "<?xml version='1.0' encoding='utf-8'?>" + cr
	+ "<preferences>" + cr
	+ "    <syntaxHighlighting showCodeMirror='" + (data.syntax_hl ? "true" : "false") + "' />" + cr
	+ "    <saveDate>"
	+            new Date().toString()
	+     "</saveDate>" + cr
	+ "</preferences>";
    },
    writeXMLData: function () {
	this.stream = new air.FileStream();
	this.stream.open(this.prefsFile, air.FileMode.WRITE);
	this.stream.writeUTFBytes(this.prefsXML);
	this.stream.close();
    },
    windowClosingHandler: function (event) {
	debug.trace("start windowClosingHandler");

	

	JSONpadAir.saveData({
	    syntax_hl: Ext.getCmp("JPviewPort").findByType("jp_main_top")[0].getTopToolbar().findByType("jp_main_top_iconbar")[0].btnGroup_others.switchHighlighting.pressed

	});

	event.preventDefault();
	nativeWindow.removeEventListener("closing", JSONpadAir.windowClosingHandler);
	
	JP.util.air.exit();
    }
}