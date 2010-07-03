var JPAir = {
    init: function () {
	window.nativeWindow.addEventListener( air.Event.CLOSING, JPAir.events.onClosingWindow );
	air.NativeApplication.nativeApplication.addEventListener( air.Event.EXITING, JPAir.events.exitingApplication );
	air.NativeApplication.nativeApplication.addEventListener( air.InvokeEvent.INVOKE, JPAir.events.invokeApplication );

	JPAir.updater.init();
	JPAir.preferences.init();
    }
};

JPAir.app = {
    xmlInfo: '',

    init: function () {
	
    },

    getApplicationInfo: function () {
	debug.trace("xx"+JPAir.app.xmlInfo);
	var appXml = new DOMParser();
	var xmlObject = appXml.parseFromString(JPAir.app.xmlInfo, "text/xml");
	var root = xmlObject.getElementsByTagName('application')[0];
	var initialWindow = root.getElementsByTagName('initialWindow')[0];

	return [root.getElementsByTagName("version")[0].firstChild.data, root.getElementsByTagName("name")[0].firstChild.data, initialWindow.getElementsByTagName("content")[0].firstChild.data];
    },

    getApplicationVersion: function () {
	return this.getApplicationInfo()[0];
    },

    getApplicationName: function () {
	return this.getApplicationInfo()[1];
    }
};

JPAir.events = {
    onClosingWindow: function (event) {

	JPAir.preferences.saveData({
	    syntax_hl: Ext.getCmp("JPviewPort").findByType("jp_main_top")[0].getTopToolbar().findByType("jp_main_top_iconbar")[0].btnGroup_others.switchHighlighting.pressed
	});

	event.preventDefault();
	nativeWindow.removeEventListener("closing", JPAir.events.onClosingWindow);

	JP.util.air.exit();
    },
    exitingApplication: function (event) {
	var opened = air.NativeApplication.nativeApplication.openedWindows;
	for (var i = 0; i < opened.length; i ++) {
	    opened[i].close();
	}
    },
    invokeApplication: function (event) {
	if ( event.arguments.length > 0 ) {
	    var path = event.arguments[0];
	    var file = new air.File(path);
	    var stream = new air.FileStream();
	    stream.open(file, air.FileMode.READ);
	    var jsonString = stream.readUTFBytes(stream.bytesAvailable);
	    stream.close();

	    //@todo setting the value at another place would be much nicier
	    Ext.getCmp("JPviewPort").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].setValue( jsonString );
	}
    },
    onSaveAsSelect: function (event) {
	event.target.removeEventListener(air.Event.SELECT, JPAir.events.onSaveAsSelect);

	var currentFile = event.target;
	var txt = Ext.getCmp("JPviewPort").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].getValue();

	try {
	    var stream = new air.FileStream();
	    stream.open(currentFile, air.FileMode.WRITE);
	    stream.writeUTFBytes(txt);
	    stream.close();
	} catch(error) {
	    alert("Error reading or writing the file.");
	}
    }
};

JPAir.updater = {
    appUpdater: null,
    configXml: "app:/update-config.xml",

    init: function () {
	JPAir.updater.appUpdater = new runtime.air.update.ApplicationUpdaterUI();

	JPAir.updater.appUpdater.configurationFile = new air.File( JPAir.updater.configXml );
	JPAir.updater.appUpdater.addEventListener(air.ErrorEvent.ERROR, JPAir.updater.onError);
	JPAir.updater.appUpdater.addEventListener("initialized", JPAir.updater.onInitialization);
	JPAir.updater.appUpdater.initialize();
    },

    checkUpdate: function () {
	JPAir.updater.appUpdater.checkNow();
    },

    onInitialization: function () {
	JPAir.updater.checkUpdate();
    },

    onError: function ( event ) {
	//@todo extjs error window
	alert(event.toString());
    }
};

JPAir.preferences = {
    prefsFile: null,
    prefsXML: null,
    stream: null,
    settings: null,

    init: function () {
	this.prefsFile = air.File.applicationStorageDirectory;
	this.prefsFile = this.prefsFile.resolvePath("settings.xml");
	this.readXML();
    },
    readXML: function () {
	this.stream = new air.FileStream();
	if (this.prefsFile.exists) {
	    this.stream.open(this.prefsFile, air.FileMode.READ);
	    this.processXMLData();
	} else {
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
    }
};