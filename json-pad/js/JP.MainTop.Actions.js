JP.MainTop.Action = {
    copyJsonStringToClipboard: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	JP.util.copyToClipboard( stringInputField.getValue() );
    },
    pasteJsonStringFromClipboard: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	var clipboardText = JP.util.pasteFromClipboard();
	stringInputField.setValue( clipboardText );
    },

    openXmlWindow: function () {
	if (JP.XmlWindow.Action.me == null)
	    JP.XmlWindow.Action.me = this;

	JP.XmlWindow.Action.openWindow();
    }
};

JP.MainTop.Action.mainBar = {
    clearApplication: function() {
	this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].setValue("");

	var tree = this.findParentByType("viewport").findByType("jp_main_center_jsonTree")[0];
	var root = {
	    text: 'JSON',
	    draggable: false,
	    leaf: true,
	    ref:'rnode',
	    type: 'object'
	};

	tree.setRootNode(root);
	tree.getLoader().load( tree.root );

	var editKeyForm = this.findParentByType("viewport").findByType("jp_main_center_ediTreeForm_tabs_edit")[0];
	editKeyForm.formUnsaved = false;

	JP.util.setJPStatus({
	    text: 'Cleared JSONpad succesfully',
	    iconCls: 'x-status-valid',
	    clear: true
	}, 'left');
    },
    saveAsFile: function () {
	if ( Ext.isAir ) {
	    var fileChooser = air.File.documentsDirectory;

	    fileChooser.browseForSave("Save");
	    fileChooser.addEventListener(air.Event.SELECT, JPAir.events.onSaveAsSelect);
	}
    },
    quitApplication: function(){
	JP.util.exit();
    },
    openSettingsWindow: function () {
	if (JP.SettingsWindow.Action.me == null)
	    JP.SettingsWindow.Action.me = this;

	JP.SettingsWindow.Action.openWindow();
    },
    openAboutWindow: function () {
	if (JP.AboutWindow.Action.me == null)
	    JP.AboutWindow.Action.me = this;

	JP.AboutWindow.Action.openWindow();
    }
};

JP.MainTop.Action.iconBar = {
    loadToTree: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	var value = stringInputField.getValue().trim();

	if (value == "") {
	    JP.util.setJPStatus({
		text: 'Empty JSON string',
		iconCls: 'x-status-error',
		clear: true
	    }, 'left');
	} else {
	    var json = JP.util.parseJson(value, true);

	    if (JP.util.validateJson(json, true)) {
		var buildObjectForTree = function (obj, treeObj, lvl, parentIsArray) {
		    var ind = null;
		    //var counter = 1;
		    lvl++;
		    var arrayIndex = 0;

		    for (ind in obj) {
			if (ind != "remove" && ind != "in_array") {
			    var text = ind;
			    var nodeType = JP.util.type( obj[ind] );

			    var nodeObject = new Object();

			    nodeObject.id = Ext.id();
			    if ( isObject( obj[ind] ) && obj[ind] != null )
			    {
				if ( parentIsArray ) {

				    //text = "[object " + nodeType.toFirstUpperCase() + "]";
				    text = "[" + new String(arrayIndex) + "]";
				    arrayIndex++;
				} else {
				    arrayIndex = 0;
				}

				nodeObject.iconCls = 'ico_' + nodeType;
				nodeObject.expandable = true;
				nodeObject.leaf = false;
				nodeObject.children = buildObjectForTree(obj[ind], [], lvl, (nodeType == "array"));
			    }
			    else
			    {
				if (obj[ind] == null)
				    nodeType = "null";

				if (parentIsArray)
				    text = obj[ind];

				nodeObject.expandable = false;
				nodeObject.leaf = true;
				nodeObject.value = obj[ind];
			    }

			    nodeObject.text = text;
			    nodeObject.type = nodeType;

			    treeObj.push( nodeObject );

			//counter++;
			}
		    }

		    return treeObj;
		};

		var rootType = (value == "" ? null : Ext.type(json));

		var treeNodes = buildObjectForTree(json, [], 0, (rootType == "array"));

		var root = JP.util.getJsonTreeDefaultRootNode( rootType, treeNodes );
		var tree = this.findParentByType("viewport").findByType("jp_main_center_jsonTree")[0];

		tree.setRootNode(root);
		tree.getLoader().load( tree.root );

		var editKeyForm = this.findParentByType("viewport").findByType("jp_main_center_ediTreeForm_tabs_edit")[0];

		editKeyForm.formUnsaved = false;

		tree.getSelectionModel().select( tree.getRootNode() );

		JP.util.setJPStatus({
		    text: 'Made succesfully a tree with the JSON string',
		    iconCls: 'x-status-valid',
		    clear: true
		}, 'left');
	    }
	}
    },
    loadFromTree: function () {
	var compress = false;


	var editKeyForm = this.findParentByType("viewport").findByType("jp_main_center_ediTreeForm_tabs_edit")[0];
	var tree = this.findParentByType("viewport").findByType("jp_main_center_jsonTree")[0];
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	var rootNode = tree.getRootNode();
	var jsonString = "";
	var lb = "";
	var spacer = ""
	var pt = ":";

	if (editKeyForm.formUnsaved) {	    
	    var sm = tree.getSelectionModel();
	    var selectedNode = sm.getSelectedNode();

	    editKeyForm.confirmUnsaved( selectedNode );
	    return false;
	}

	if (!compress) {
	    lb = "\n";
	    spacer = "\t";
	    pt = " : ";
	}

	var buildJSONString = function ( node, jsonString, lvl, compress ) {
	    lvl++;

	    var tab = "";
	    for (var i = 1; i < lvl; i++)
		tab += spacer;

	    var collapseNode = false;
	    if (node.isExpandable() && !node.isExpanded()) {
		node.expand();
		collapseNode = true;
	    }

	    node.eachChild(function (child) {
		var childText = child.attributes.text;
		childText = unescape(escape(childText).replace(/\%0A/g, "\\n"));
		childText = childText.replace(/\\n|\\r/g, "\\n").replace(/\"/g, '\\"');

		if ( child.hasChildNodes() ) {
		    if ( child.attributes.type == "array" && node.attributes.type != "array" )
			jsonString += tab + spacer + '"' + childText + '"' + pt + '[' + lb;
		    else
		    {
			jsonString += tab + spacer;

			if ( node.attributes.type != "array" )
			    jsonString += '"' + childText + '"' + pt;

			jsonString += (child.attributes.type == "array" ? '[' : "{") + lb;
		    }

		    jsonString = tab + buildJSONString ( child, jsonString, lvl, compress );

		    jsonString += tab + spacer + (child.attributes.type == "array" ? ']' : '}');
		}
		else
		{
		    var nodeValue = child.attributes.value;
		    nodeValue = unescape(escape(nodeValue).replace(/\%0A/g, "\\n"));
		    nodeValue = nodeValue.replace(/\\n|\\r/g, "\\n").replace(/\"/g, '\\"');

		    if ( child.attributes.type == "string" )
			nodeValue = '"' + nodeValue + '"';

		    jsonString += tab + spacer;

		    if ( node.attributes.type == "array" )
			jsonString += nodeValue;
		    else
			jsonString += '"' + childText + '"' + pt + nodeValue;
		}

		jsonString += ( !child.isLast() ? "," : "" ) + lb;
	    });

	    if (collapseNode) {
		node.collapse();
		collapseNode = false;
	    }

	    return jsonString;
	};


	if ( rootNode.attributes.type == "array" )
	    jsonString += "[" + lb;
	else
	    jsonString += "{" + lb;

	jsonString = buildJSONString ( rootNode, jsonString, 0, compress );

	if ( rootNode.attributes.isArray )
	    jsonString += "]" + lb;
	else
	    jsonString += "}" + lb;

	stringInputField.setValue( jsonString.trim() );

	JP.util.setJPStatus({
	    text: 'Tree built to JSON string',
	    iconCls: 'x-status-valid',
	    clear: true
	}, 'left');

	return true;
    },

    compressJsonString: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	var stringCompressed = jsmin("", stringInputField.getValue(), 3);

	stringInputField.setValue( stringCompressed.trim() );
	JP.util.setJPStatus({
	    text: 'Compressed JSON string succesfully',
	    iconCls: 'x-status-valid',
	    clear: true
	}, 'left');
    },
    formatJsonString: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];

	var json = JP.util.parseJson(stringInputField.getValue(), true);

	if (JP.util.validateJson(json, true)) {
	    stringInputField.setValue( JSON.stringify(json, null, '  ') );
	    JP.util.setJPStatus({
		text: 'Formatted JSON string succesfully',
		iconCls: 'x-status-valid',
		clear: true
	    }, 'left');
	}
    },

    validateJsonString: function () {
	var stringInputField = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];

	if (stringInputField.getValue().trim() == "") {
	    JP.util.setJPStatus({
		text: 'Empty JSON string',
		iconCls: 'x-status-error',
		clear: true
	    }, 'left');
	} else {
	    var json = JP.util.parseJson(stringInputField.getValue(), true);

	    if (JP.util.validateJson(json, false)) {
		JP.util.setCodeMirrorStatus({
		    text: 'JSON string is valid',
		    iconCls: 'x-status-valid',
		    clear: true
		});
	    }
	}
    },

    switchHighlighting: function (btn, pressed) {
	var stringInput = this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
	if (pressed == true) stringInput.showCodeMirror();
	else stringInput.hideCodeMirror();
    },

    insertExample: function () {
	this.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0].setValue(this.example);
    },

    fetchJsonByUrl: function (field, value) {
	var me = this;
	if ( !isUrl(value) ) {
	    Ext.Msg.show({
		title: 'No valid url',
		msg: 'Please enter a valid url with http://!',
		buttons: Ext.MessageBox.OK,
		icon: Ext.MessageBox.ERROR
	    });
	} else {
	    var conn = new Ext.data.Connection();
	    conn.request({
		url: value,
		method: 'POST',
		success: function(responseObject) {
		    var stringInputField = me.findParentByType("viewport").findByType("jp_main_center_stringForm")[0].findByType("ux-codemirror")[0];
		    var json = JP.util.parseJson(responseObject.responseText, true);

		    if (JP.util.validateJson(json, true)) {
			JP.util.setJPStatus({
			    text: 'Fetched JSON string succesfully',
			    iconCls: 'x-status-valid',
			    clear: true
			}, 'left');
		    }
		    
		    stringInputField.setValue( JSON.stringify(json, null, '  ') );
		},
		failure: function() {
		    Ext.Msg.show({
			title: 'Fetching error',
			msg: 'Unable to fetch JSON string from url: ' + value,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.ERROR
		    });
		}
	    });
	}
    }
};