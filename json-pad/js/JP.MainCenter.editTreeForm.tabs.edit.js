JP.MainCenter.ediTreeForm.tabs.edit = Ext.extend(Ext.Panel, {
    title: 'Edit',
    layout: 'anchor',
    frame: false,
    border: false,
    disabled: true,
    formUnsaved: false,
    initComponent: function() {
	var me = this;

	this.items = [
	{
	    xtype: 'jp_main_center_ediTreeForm_tabs_edit_key'
	},{
	    xtype: 'jp_main_center_ediTreeForm_tabs_edit_object'
	}
	];

	JP.MainCenter.ediTreeForm.tabs.edit.superclass.initComponent.call(this);

	me.addListener("afterrender", function () {
	    this.disable();
	}, me);

	me.addListener("disable", function () {
	    this.keyForm.jsonkey.setValue( "" );
	    this.keyForm.jsonvalue.setValue( "" );
	    this.keyForm.isnull.setValue( false );
	    this.keyForm.hide();
	    this.objectForm.jsonIndex.setValue( "" );
	    this.objectForm.hide();

	    var tb = this.findParentByType("jp_main_center_ediTreeForm").getTopToolbar();
	    tb.save.disable();

	    this.formUnsaved = false;
	}, me);

	me.addListener("enable", function () {
	    /*var tb = this.findParentByType("jp_main_center_ediTreeForm").getTopToolbar();
	    tb.save.enable();*/
	    }, me);
    },
    enableKeyForm: function () {
	if (this.disabled) this.enable();
	if (this.objectForm.isVisible()) this.objectForm.hide();
	if (!this.keyForm.isVisible()) this.keyForm.show();
    },
    enableObjectForm: function () {
	if (this.disabled) this.enable();
	if (this.keyForm.isVisible()) this.keyForm.hide();
	if (!this.objectForm.isVisible()) this.objectForm.show();
    },
    formChanged: function () {
	var tb = this.findParentByType("jp_main_center_ediTreeForm").getTopToolbar();
	tb.save.enable();
	this.formUnsaved = true;
    },
    confirmUnsaved: function (n) {
	var form = Ext.getCmp("JPviewPort").findByType("jp_main_center_ediTreeForm_tabs_edit")[0];
	Ext.MessageBox.confirm("Form is unsaved!", "Your data is unsaved. Save before doing action?", function (button) {
	    if (button == "yes") {
		form.saveForm(form);
	    } else if (button == "no") {
		debug.trace("nno");
		form.formUnsaved = false;
		debug.trace(form.formUnsaved);
	    }
	    var tree = Ext.getCmp("JPviewPort").findByType("jp_main_center_jsonTree")[0];
	    var sm = tree.getSelectionModel();

	    sm.select(n);
	    
	    return true;
	});
    },
    saveForm: function (form) {
	var activeForm = null;
	var tree = Ext.getCmp("JPviewPort").findByType("jp_main_center_jsonTree")[0];
	var treeSm = tree.getSelectionModel();
	var node = treeSm.getSelectedNode();
	var statustext = "";

	if (form.keyForm.isVisible()) {
	    activeForm = form.keyForm;

	    var jsonIsNull = activeForm.isnull.getValue();
	    var jsonKey = activeForm.jsonkey.getValue();
	    var jsonValue = (jsonIsNull ? "null" : activeForm.jsonvalue.getValue());

	    if (jsonIsNull || jsonValue == null)
		node.attributes.type = "null";
	    else
		node.attributes.type = Ext.type( jsonValue );

	    if ( node.parentNode.attributes.type == "array" ) {
		var nodeText = "";
		if (jsonValue == "") nodeText = JP.util.getJsonTreeNodeString("empty", false);
		else if (jsonValue == "null") nodeText = JP.util.getJsonTreeNodeString("null", false);
		else nodeText = jsonValue;

		node.setText ( nodeText );
		activeForm.jsonkey.setValue( jsonValue );
	    } else {
		node.setText ( (jsonKey != "" ? jsonKey : JP.util.getJsonTreeNodeString("empty", false)) );
	    }
	    node.attributes.value = jsonValue;

	    statustext = "Saved selected key successfully";
	} else if (form.objectForm.isVisible()) {
	    activeForm = form.objectForm;

	    var jsonIndex = activeForm.jsonIndex.getValue();

	    node.setText ( (jsonIndex != "" ? jsonIndex : JP.util.getJsonTreeNodeString("empty", false)) );

	    statustext = "Saved selected " + node.attributes.type + " successfully";
	}

	var tb = form.findParentByType("jp_main_center_ediTreeForm").getTopToolbar();
	tb.save.disable();

	JP.util.setJPStatus({
	    text: statustext,
	    iconCls: 'x-status-valid',
	    clear: true
	}, "left");

	form.formUnsaved = false;
    }
});

Ext.reg('jp_main_center_ediTreeForm_tabs_edit', JP.MainCenter.ediTreeForm.tabs.edit);