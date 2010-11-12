var JPAir = {
    init: function () {
	window.nativeWindow.addEventListener( air.Event.CLOSING, JPAir.events.onClosingWindow );
	air.NativeApplication.nativeApplication.addEventListener( air.Event.EXITING, JPAir.events.exitingApplication );
	air.NativeApplication.nativeApplication.addEventListener( air.InvokeEvent.INVOKE, JPAir.events.invokeApplication );

	JPAir.preferences.init();
	JPAir.updater.init();
    }
};

JPAir.app = {
    xmlInfo: '',

    init: function () {
	
    },

    getApplicationInfo: function () {
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
	//debug.dump(JPAir.preferences.settings, "JPAir.preferences.settings");
	JPAir.preferences.saveData( JPAir.preferences.settings );

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
	//alert("-event.arguments.length-"+event.arguments.length);
	if ( event.arguments.length > 0 ) {
	    var path = event.arguments[0];
	    //alert("-path-"+path);
	    var file = new air.File(path);
	    var stream = new air.FileStream();
	    stream.open(file, air.FileMode.READ);
	    var jsonString = stream.readUTFBytes(stream.bytesAvailable);
	    stream.close();

	    //alert("--"+jsonString+"---");

	    //@todo setting the value at another place would be much nicier
	    //@todo all in all... THIS IS BAD!!!
	    (function () {
		if (typeof(Ext.getCmp("JPviewPort").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0]) == "undefined") {
		    (function () {
			Ext.getCmp("JPviewPort").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].setValue( jsonString );
		    }).defer(250);
		} else {
		    Ext.getCmp("JPviewPort").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].setValue( jsonString );
		}
	    }).defer(1500);
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
	if (JPAir.preferences.settings.app.checkForUpdate)
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
	this.prefsFile = this.prefsFile.resolvePath("debug01.xml");
	this.readXML();
    },
    readXML: function () {
	this.stream = new air.FileStream();
	if (!this.prefsFile.exists) {
	    this.saveData({
		app: {
		    jsonDefaultApp: true,
		    jsonValidateLevel: "strict",
		    checkForUpdate: true,
		    syntax_hl: true
		},
		dialog: {
		    checkDefaultApp: true
		}
	    });
	}
	
	this.stream.open(this.prefsFile, air.FileMode.READ);
	this.processXMLData();
	window.nativeWindow.visible = true;
    },
    processXMLData: function () {
	this.prefsXML = this.stream.readUTFBytes(this.stream.bytesAvailable);
	this.stream.close();
	var domParser = new DOMParser();
	this.prefsXML = domParser.parseFromString(this.prefsXML, "text/xml");

	var jsonApp = this.prefsXML.getElementsByTagName("jsonApp")[0];
	var jsonDefault = false;
	var checkForUpdate = false;
	var showCodeMirror = false;
	var jsonValidateLevel = "strict";


	if ( jsonApp ) {
	    //debug.dump(jsonApp.getAttribute("jsonDefaultApplication"), "jsonApp");
	    jsonDefault = ( jsonApp.getAttribute("jsonDefaultApplication").toString() == "true" ? true : false );
	    checkForUpdate = ( jsonApp.getAttribute("checkForUpdate").toString() == "true" ? true : false );
	    showCodeMirror = ( jsonApp.getAttribute("showCodeMirror").toString() == "true" ? true : false );
	    jsonValidateLevel = jsonApp.getAttribute("jsonValidateLevel").toString();
	}

	var jsonAppDialog = this.prefsXML.getElementsByTagName("jsonAppDialog")[0];
	var dialogCheckDefault = false;
	if ( jsonAppDialog ) {
	    dialogCheckDefault = ( jsonAppDialog.getAttribute("hideCheckForDefaultApp").toString() == "true" ? true : false );
	}

	air.trace("And we show cause... " +jsonApp + "==jsonApp && "+jsonDefault+"==jsonDefault && isDefault=="+air.NativeApplication.nativeApplication.isSetAsDefaultApplication("json"));
	if ( (!jsonApp || jsonDefault) && !air.NativeApplication.nativeApplication.isSetAsDefaultApplication("json") ) {
	    Ext.MessageBox.confirm('Register .json files?', 'Do you want register .json files to JSONpad?', function (btn) {
		if (btn == "yes") {
		    jsonDefault = true;
		    air.NativeApplication.nativeApplication.setAsDefaultApplication("json");
		} else {
		    jsonDefault = false;
		}
	    });
	}

	if (jsonValidateLevel == "undefined") jsonValidateLevel = "strict";

debug.trace("_______"+jsonValidateLevel);
	this.settings = {
	    app: {
		syntax_hl: showCodeMirror,
		jsonDefaultApp: jsonDefault,
		jsonValidateLevel: jsonValidateLevel,
		checkForUpdate: checkForUpdate
	    },
	    dialog: {
		checkDefaultApp: dialogCheckDefault
	    }
	};
    },
    saveData: function (data) {
	//debug.dump(data, "data");
	this.createXMLData(data);
	this.writeXMLData();
    },
    createXMLData: function (data) {
	//debug.trace(data.checkForUpdate + " == " + typeof(data.checkForUpdate));
	var cr = air.File.lineEnding;
	this.prefsXML =   "<?xml version='1.0' encoding='utf-8'?>" + cr
	+ "<preferences>" + cr
	+ "    <jsonApp jsonDefaultApplication='" + ( data.app.jsonDefaultApp ? "true" : "false") + "' "
	+ "		checkForUpdate='" + ( data.app.checkForUpdate ? "true" : "false") + "' "
	+ "		jsonValidateLevel='" + data.app.jsonValidateLevel + "' "
	+ "		 showCodeMirror='" + ( data.app.syntax_hl ? "true" : "false") + "' />" + cr
	+ "    <jsonAppDialog hideCheckForDefaultApp='" + ( data.dialog.checkDefaultApp ? "true" : "false") + "' />" + cr
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