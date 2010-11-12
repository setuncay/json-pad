JP.MainCenter.ediTreeForm.tabs.edit.jsonObject = Ext.extend(Ext.FormPanel, {
    layout: 'form',
    frame: true,
    border: false,
    ref: 'objectForm',
    anchor: '100% 100%',
    initComponent: function() {
	var me = this;

	this.items = [
	{
	    xtype: 'textarea',
	    fieldLabel: 'Indexname',
	    anchor: '100%',
	    name: 'jsonIndex',
	    ref: 'jsonIndex',
	    enableKeyEvents: true
	}
	];

	JP.MainCenter.ediTreeForm.tabs.edit.jsonObject.superclass.initComponent.call(this);

	var tabsEdit = me.findParentByType("jp_main_center_ediTreeForm_tabs_edit");

	this.jsonIndex.addListener('change', tabsEdit.formChanged, tabsEdit);

	var str = "";
	this.jsonIndex.addListener('keydown', function () {
	    if (!tabsEdit.formUnsaved)
		str = this.getValue();
	}, this.jsonkey);

	this.jsonIndex.addListener('keyup', function () {
	    if (str != this.getValue() && !tabsEdit.formUnsaved)
		this.fireEvent("change");
	}, this.jsonkey);
    }
});

Ext.reg('jp_main_center_ediTreeForm_tabs_edit_object', JP.MainCenter.ediTreeForm.tabs.edit.jsonObject);