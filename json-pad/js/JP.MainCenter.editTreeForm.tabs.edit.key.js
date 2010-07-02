JP.MainCenter.ediTreeForm.tabs.edit.jsonKey = Ext.extend(Ext.FormPanel, {
    layout: 'form',
    frame: true,
    border: false,
    ref: 'keyForm',
    anchor: '100% 100%',
    initComponent: function() {
	var me = this;

	this.items = [
	{
	    xtype: 'textarea',
	    fieldLabel: 'Key',
	    anchor: '100%',
	    name: 'jsonKey',
	    ref: 'jsonkey',
	    enableKeyEvents: true
	},
	{
	    xtype: 'textarea',
	    fieldLabel: 'Value',
	    anchor: '100%',
	    name: 'jsonValue',
	    ref: 'jsonvalue',
	    enableKeyEvents: true
	},
	{
	    xtype: 'checkbox',
	    fieldLabel: 'isNull',
	    anchor: '100%',
	    name: 'isNull',
	    ref: 'isnull'
	}
	];

	JP.MainCenter.ediTreeForm.tabs.edit.jsonKey.superclass.initComponent.call(this);

	var tabsEdit = me.findParentByType("jp_main_center_ediTreeForm_tabs_edit");

	this.jsonkey.addListener('change', tabsEdit.formChanged, tabsEdit);
	this.jsonvalue.addListener('change', tabsEdit.formChanged, tabsEdit);
	this.isnull.addListener('change', tabsEdit.formChanged, tabsEdit);

	this.isnull.addListener('check', function (checkbox, checked) {
	    if (this.isnull.autoTrigger) {
		if (checked) {
		    this.jsonvalue.setValue("null");
		    this.jsonvalue.disable();
		} else {
		    this.jsonvalue.setValue("");
		    this.jsonvalue.enable();
		}
		this.jsonvalue.fireEvent("change");
	    }
	}, this);

	this.isnull.addListener('afterrender', function(c) {
	    new Ext.ToolTip({
		target: this.isnull.id,
		html: 'Set value to "null"'
	    });
	}, this);


	var str = "";
	this.jsonkey.addListener('keydown', function () {
	    if (!tabsEdit.formUnsaved)
		str = this.getValue();
	}, this.jsonkey);

	this.jsonkey.addListener('keyup', function () {
	    if (str != this.getValue() && !tabsEdit.formUnsaved)
		this.fireEvent("change");
	}, this.jsonkey);

	this.jsonvalue.addListener('keydown', function () {
	    if (!tabsEdit.formUnsaved)
		str = this.getValue();
	}, this.jsonvalue);

	this.jsonvalue.addListener('keyup', function () {
	    if (str != this.getValue() && !tabsEdit.formUnsaved)
		this.fireEvent("change");
	}, this.jsonvalue);
    }
});

Ext.reg('jp_main_center_ediTreeForm_tabs_edit_key', JP.MainCenter.ediTreeForm.tabs.edit.jsonKey);