JP.MainCenter.jsonTree = Ext.extend(Ext.tree.TreePanel, {
    title: '',
    region: 'west',
    split: true,
    width: 300,
    border: true,
    enableDD: true,
    autoScroll: true,
    ddGroup: 'nodeDragAndDrop',
    treeContextMenu: null,
    //activeTab: 0,
    //id: 'JPsouth',
    initComponent: function() {
	var sm = this.getSelectionModel();
	var me = this;

	this.hiddenNodes = [];

	this.plugins = [new NodeMouseoverPlugin(), new NodeMouseoutPlugin()];

	this.tbar = {
	    xtype: 'jp_main_center_jsonTree_toolbar'
	};

	this.root = {
	    text: 'JSON',
	    draggable: false,
	    leaf: true,
	    ref:'rnode',
	    type: 'object'
	};

	JP.MainCenter.jsonTree.superclass.initComponent.call(this);

	me.addListener("afterRender", function (tree) {
	    var topBar = this.getTopToolbar();
	    var btnDelete = topBar.deleteNode;
	    var btnDuplicate = topBar.duplicateNode;

	    me.treeContextMenu = new JP.MainCenter.jsonTree.contextMenu();

	    new Ext.dd.DropTarget(btnDelete.el, {
		available: true,
		ddGroup: 'nodeDragAndDrop',
		copy: false,
		notifyDrop: function(dd, e, data) {
		    (function() {
			JP.MainCenter.Action.tree.deleteNode();
		    //JsonTreeFunctions.deleteNode();
		    }).defer(50);
		    return true;
		}
	    });

	    new Ext.dd.DropTarget(btnDuplicate.el, {
		available: true,
		ddGroup: 'nodeDragAndDrop',
		copy: false,
		notifyDrop: function(dd, e, data) {
		    (function() {
			JP.MainCenter.Action.tree.duplicateNode();
		    }).defer(50);
		    return true;
		}
	    });
	}, me);

	me.addListener("mouseover", function(node) {
	    if (node.getDepth() > 0) {
		var value = node.attributes.value;

		if (node.attributes.type == "array" || node.attributes.type == "object")
		    value = "<i>&lt;" + node.attributes.type.toFirstUpperCase() + "&gt;</i>";

		JP.util.setJPStatus({
		    text: "<b>" + node.attributes.text + ":</b>  " + value
		}, 'right');
	    } else {
		JP.util.clearJPStatus("right");
	    }
	});

	me.addListener("mouseout", function(node) {
	    JP.util.clearJPStatus("right");
	});

	me.addListener("contextmenu", function(node, event) {
	    var selectionModel = me.getSelectionModel();
	    selectionModel.select( node );

	    me.treeContextMenu.showAt(event.getXY());
	    event.stopEvent();
	}, me);

	me.addListener("textchange", function (n, str, strOld) {
	    JP.MainCenter.Action.tree.setTreePath( n, this );
	}, me);

	sm.addListener("selectionchange", function (sel, n) {
	    debug.trace("selectionchange");
	    deactivateTrigger = false;
	});
	sm.addListener("beforeselect", function (sel, n, o) {
	    var editKeyForm = this.findParentByType("viewport").findByType("jp_main_center_ediTreeForm_tabs_edit")[0];
	    var topBar = this.getTopToolbar();
debug.trace("form is unsaved oO ... " + editKeyForm.formUnsaved);
	    editKeyForm.ignoreChanges = true;
	    deactivateTrigger = true;

	    if (editKeyForm.formUnsaved) {
		editKeyForm.confirmUnsaved(n);
		return false;
	    }

	    if (n.getDepth() == 0) {
		editKeyForm.disable();
		topBar.duplicateNode.disable();
		topBar.deleteNode.disable();
		this.treeContextMenu.duplicateNode.disable();
		this.treeContextMenu.deleteNode.disable();
	    } else {
		topBar.duplicateNode.enable();
		topBar.deleteNode.enable();
		this.treeContextMenu.duplicateNode.enable();
		this.treeContextMenu.deleteNode.enable();

		var nodeText = "";
		if ( n.attributes.text == JP.util.getJsonTreeNodeString("empty", false) ) nodeText = "";
		else if ( n.attributes.text == JP.util.getJsonTreeNodeString("null", false) ) nodeText = "null";
		else nodeText = n.attributes.text;

		if ( n.attributes.leaf == true ) {
		    
		    editKeyForm.keyForm.jsontype.setValue( n.attributes.type );
		    
		    editKeyForm.keyForm.jsonkey.setValue( nodeText );
		    editKeyForm.keyForm.jsonvalue.setValue( n.attributes.value );
		    /*
		    editKeyForm.keyForm.isnull.setValue( ( n.attributes.type == "null" ) );
		    editKeyForm.keyForm.isnull.autoTrigger = true;*/
		    //editKeyForm.keyForm.isnull.checked = ( n.attributes.type == "null" );
		    //editKeyForm.keyForm.isnull.update();

		    if ( n.parentNode != null && n.parentNode.attributes.type == "array" )
			editKeyForm.keyForm.jsonkey.disable();
		    else
			editKeyForm.keyForm.jsonkey.enable();

		    if ( n.attributes.type == "null" )
			editKeyForm.keyForm.jsonvalue.disable();
		    else
			editKeyForm.keyForm.jsonvalue.enable();

		    editKeyForm.enableKeyForm();
		} else {
		    editKeyForm.enableObjectForm();
		    editKeyForm.objectForm.jsonIndex.setValue( nodeText );

		    if (n.parentNode.attributes.type == "array") {
			editKeyForm.objectForm.jsonIndex.setValue("ARRAY VALUE");
			editKeyForm.objectForm.jsonIndex.disable();
		    } else {
			editKeyForm.objectForm.jsonIndex.enable();
		    }
		}
	    }

	    JP.MainCenter.Action.tree.setTreePath( n, this );
	    editKeyForm.ignoreChanges = false;

	    return true;
	}, me);
    },
    filterNodes: function(pattern, me){

	// un-hide the nodes that were filtered last time
	Ext.each(me.hiddenNodes, function(n){
	    n.ui.show();
	});

	if(!pattern){
	    // no pattern -> nothing to be done
	    return;
	}

	me.expandAll();

	var re = new RegExp('^.*' + Ext.escapeRe(pattern) + '.*', 'i');

	me.root.cascade( function(n){
	    if (re.test(n.text) || re.test(n.attributes.value) || n.getDepth() == 0) {
		n.ui.show();
		n.bubble(function(){
		    this.ui.show();
		});
	    } else {
		n.ui.hide();
		me.hiddenNodes.push(n);
	    }
	}, me);
    }
});

Ext.reg('jp_main_center_jsonTree', JP.MainCenter.jsonTree);