JP.XmlWindow.Action = {
    me: null,
    window: null,
    setXmlData: function () {
	var me = JP.XmlWindow.Action.me;
	var stringInputField = me.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	var value = stringInputField.getValue();

	if (value.trim() != "") {
	    var json = JP.util.parseJson(value);
	    var xmlInputField = Ext.getCmp("JP_convertXmlWindow").findByType("jp_xmlwindow_xmlform")[0].findByType("ux-codemirror")[0];

	    if (JP.util.validateJson(json, true)) {
		var xmlData = xmlJsonClass.json2xml(json, "  ");

		var xmlDataArr = xmlData.split("\n");

		for (var i = 0; i < xmlDataArr.length; i++)
		    xmlDataArr[i] = (i < xmlDataArr.length-1 ? "  " : "") + xmlDataArr[i];

		xmlData = "<root>\n"+xmlDataArr.join("\n")+"</root>";

		xmlInputField.setValue(xmlData);
	    } else {
		xmlInputField.setValue("");
	    }
	} else {
	    stringInputField.setValue("");
	}
    },
    setJsonData: function (xmlData) {
	if (xmlData.trim() != "") {
	    var me = JP.XmlWindow.Action.me;
	    var stringInputField = me.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	    var forceString = Ext.getCmp("JP_convertXmlWindow").findByType("jp_xmlwindow_xmlform")[0].getTopToolbar().btnGroup_others.forceStringValue;

	    var jsonData = xmlJsonClass.xml2json(parseXml(xmlData), "  ", true, forceString.pressed);
	    stringInputField.setValue(jsonData);
	}
    },
    openWindow: function () {
	if(!JP.XmlWindow.Action.window) {
	    JP.XmlWindow.Action.window = new JP.XmlWindow();
	} else {
	    JP.XmlWindow.Action.setXmlData();
	}
	JP.XmlWindow.Action.window.show();
    }
};

JP.XmlWindow.Action.tbar = {
    copyXmlStringToClipboard: function () {
	var xmlInputField = Ext.getCmp("JP_convertXmlWindow").findByType("jp_xmlwindow_xmlform")[0].findByType("ux-codemirror")[0];
	JP.util.copyToClipboard( xmlInputField.getValue() );

    //setStatusbarStatus("JSON String erfolgreich in die Zwischenablage kopiert", "valid", true); //@todo Status Nachricht implementieren
    },
    pasteXmlStringFromClipboard: function () {
	var xmlInputField = Ext.getCmp("JP_convertXmlWindow").findByType("jp_xmlwindow_xmlform")[0].findByType("ux-codemirror")[0];
	var clipboardText = JP.util.pasteFromClipboard();
	xmlInputField.setValue( clipboardText );
    },

    switchHighlighting: function (btn, pressed) {
	var xmlInputField = Ext.getCmp("JP_convertXmlWindow").findByType("jp_xmlwindow_xmlform")[0].findByType("ux-codemirror")[0];
	if (pressed == true) xmlInputField.showCodeMirror();
	else xmlInputField.hideCodeMirror();
    }
};