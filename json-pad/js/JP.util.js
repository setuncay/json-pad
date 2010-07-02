JP.util = {
    exit: function () {
	if ( Ext.isAir ) JP.util.air.exit();
	else JP.util.web.exit();
    },
    copyToClipboard: function (string) {
	if ( Ext.isAir ) JP.util.air.copyToClipboard(string);
	else JP.util.web.copyToClipboard(string);
    },
    pasteFromClipboard: function () {
	if ( Ext.isAir ) return JP.util.air.pasteFromClipboard();
	else return JP.util.web.pasteFromClipboard();
    },
    validateJson: function (json, clear) {
	if (!json.errorObject) {
	    debug.trace("clear?"+clear);
	    if (clear) JP.util.clearCodeMirrorStatus();

	    return true;
	} else {
	    JP.util.setCodeMirrorStatus({
		text: json.errorObject.length + ' error/s in JSON string. Click for details...',
		iconCls: 'x-status-error x-status-error-detail-link',
		clear: false
	    });

	    JP.ErrorWindow.Action.init();

	    JP.ErrorWindow.Action.window.setTitle(json.errorObject.length + " error/s found");

	    var msg = "";
	    for (var i = 0; i < json.errorObject.length; i++) {
		msg += '<li style="list-style-type:disc; margin-left: 18px;">' + json.errorObject[i].msg + '</li>';

		if (json.errorObject[i].evi)
		    msg += '<li style="list-style-type:none; padding-bottom: 2px; margin-left: 6px; font-family: monospace;">-&gt; ' + json.errorObject[i].evi.trim() + '</li>';
	    }

	    if (JP.ErrorWindow.Action.window.isVisible()) JP.ErrorWindow.Action.window.update('<ul style="">' + msg + '</ul>');

	    var errorContainer = Ext.get(Ext.query(".x-status-error-detail-link")); //@todo Not good for tab plans..
	    errorContainer.on("click", function (e, t, o) {
		debug.trace(t.id);
		var cmp = Ext.getCmp(t.id);
		var pos = cmp.getPosition();

		if (JP.ErrorWindow.Action.me == null)
		    JP.ErrorWindow.Action.me = this;

		JP.ErrorWindow.Action.openWindow();

		JP.ErrorWindow.Action.window.update('<ul style="">' + msg + '</ul>');
		JP.ErrorWindow.Action.window.setPosition( pos[0]+25, pos[1] );
	    }, this);

	    return false;
	}
    },
    parseJson: function (string) {
	var lint = JSLINT(string);

	if (lint) {
	    try {
		return Ext.decode( string );
	    } catch (err) {
		return false;
	    }
	} else {
	    var errorArray = [];
	    //debug.trace("--"+JSLINT.errors.length);
	    //debug.dump(JSLINT.errors);
	    var i = null;
	    for (i in JSLINT.errors) {
		var extraCond = false;

		if (JSLINT.errors.length > 1) {
		    if (parseInt(i) > (JSLINT.errors.length-2)) extraCond = true;
		}

		if (i != "remove" && i != "in_array" && !extraCond) {
		    //    debug.trace("--"+i);
		    //debug.dump(JSLINT.errors[i], "JSLINT.errors[i]");
		    var errorMsg = "Error on line {0} character {1}: {2}";
		    var errorExplain = (JSLINT.errors[i]["reason"] ? JSLINT.errors[i]["reason"] : "");

		    var err = {
			line: JSLINT.errors[i]["line"],
			character: JSLINT.errors[i]["character"],
			msg: String.format(errorMsg, JSLINT.errors[i]["line"], JSLINT.errors[i]["character"], errorExplain),
			evi: JSLINT.errors[i]["evidence"]
		    }

		    errorArray.push(err);
		}
	    }

	    return {
		errorObject: errorArray
	    };
	}
    },
    setJPStatus: function (options, align) {
	if (align == "left") {
	    var sb = Ext.getCmp("JPmainStatusBar"); //@todo We don't like Ext.getCmp at this place!
	    sb.setStatus(options);
	} else if (align == "right") {

	    var text = "";

	    if (Ext.type(options) == "object") text = options.text;
	    else text = options;

	    var sbRight = Ext.getCmp('JPmainStatusBar_Right'); //@todo We don't like Ext.getCmp at this place!
	    sbRight.setText(text);
	}
    },
    clearJPStatus: function (align) {
	if (align == "left") {
	    var sb = Ext.getCmp("JPmainStatusBar"); //@todo We don't like Ext.getCmp at this place!
	    sb.clearStatus({
		anim: true
	    });
	} else if (align == "right") {
	    var sbRight = Ext.getCmp('JPmainStatusBar_Right'); //@todo We don't like Ext.getCmp at this place!
	    sbRight.setText("");
	}
    },
    setCodeMirrorStatus: function (options) {
	var sb = Ext.getCmp("JPstringInputStatusBar"); //@todo We don't like Ext.getCmp at this place!
	sb.setStatus(options);
    },
    clearCodeMirrorStatus: function () {
	var sb = Ext.getCmp("JPstringInputStatusBar"); //@todo We don't like Ext.getCmp at this place!
	sb.clearStatus({
	    anim: true
	});
    },
    getJsonTreeDefaultRootNode: function ( rootType, children ) {
	var isLeaf = true;
	var icoClass = '';
	var expanded = false;

	if ( rootType != null && rootType != "" && children != null )
	{
	    isLeaf = false;
	    icoClass = "ico_" + rootType;
	    expanded = true;
	}

	var rootNode = new Ext.tree.TreeNode({
	    text: 'JSON',
	    value: '|||JSON|ROOT|NODE|||',
	    draggable:false,
	    leaf: isLeaf,
	    iconCls: icoClass,
	    type: rootType,
	    children: children,
	    expanded: expanded
	});
	return rootNode;
    },
    getJsonTreeNodeString: function (str, raw) {
	var ind;
	switch(str.toLowerCase()) {
	    case 'empty':
		ind = 0;
		break;
	    case 'null':
		ind = 1;
		break;
	}

	if (raw)
	    return JP.constant.NODE_STRING[ind];
	else
	    return JP.constant.NODE_STRING[ind].replace(/\</g,"&lt;").replace(/\>/g,"&gt;");
    }
};

JP.util.web = {
    exit: function () {
	self.close();
    },
    copyToClipboard: function (string) {
    //@todo Copy to clipboard für browser einfügen
    },
    pasteFromClipboard: function () {
    //@todo Paste fromt clipboard für browser einfügen
    }
};

JP.util.air = {
    exit: function () {
	var exitingEvent = new air.Event(air.Event.EXITING, false, true);
	air.NativeApplication.nativeApplication.dispatchEvent(exitingEvent);
	if (!exitingEvent.isDefaultPrevented())
	    air.NativeApplication.nativeApplication.exit();
    },
    copyToClipboard: function (string) {
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT, string, false);
    },
    pasteFromClipboard: function () {
	var txt = air.Clipboard.generalClipboard.getData( air.ClipboardFormats.TEXT_FORMAT );

	if (txt == null)
	    txt = "";

	return txt.trim();
    }
};