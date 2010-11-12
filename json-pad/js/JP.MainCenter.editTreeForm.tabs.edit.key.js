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
	    xtype:          'combo',
	    mode:           'local',
	    value:          'string',
	    anchor:         '50%',
	    triggerAction:  'all',
	    forceSelection: true,
	    id: "jsontypetest",
	    ref:            'jsontype',
	    //editable:       false,
	    fieldLabel:     'Datatype',
	    name:           'datatype',
	    hiddenName:     'datatype_hidden',
	    displayField:   'caption',
	    valueField:     'type',
	    tpl: combo_datatype,
	    store: new Ext.data.ArrayStore({
		fields: ['caption', 'type'],
		data : [
		['String', 'string'],
		['Number', 'number'],
		['Boolean', 'boolean'],
		['NULL', 'null']
		]
	    })
	},
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
	}/*,
	{
	    xtype: 'checkbox',
	    fieldLabel: 'isNull',
	    anchor: '100%',
	    name: 'isNull',
	    ref: 'isnull'
	}*/
	];

	JP.MainCenter.ediTreeForm.tabs.edit.jsonKey.superclass.initComponent.call(this);

	var tabsEdit = me.findParentByType("jp_main_center_ediTreeForm_tabs_edit");

	var comboVal = "";

	

	this.jsontype.addListener('beforeselect', function (combo, record, index) {
	    comboVal = combo.getValue();
	});

	this.jsontype.addListener('select', function (combo, record, index) {
	    debug.trace("how the fu..."+deactivateTrigger);
	    if (!deactivateTrigger) {
		debug.trace("__"+record.get("type")+"__");
		debug.trace("--"+this.jsontype.getValue());
		debug.trace("::"+combo.getValue());
		debug.trace("xx"+index);

		if (comboVal != record.get("type") && comboVal != "") {
		    switch ( record.get("type") ) {
			case 'null':
			    this.jsonvalue.setValue("null");
			    this.jsonvalue.disable();
			    break;
			default:
			    if (comboVal == "null")
				this.jsonvalue.setValue("");
			    
			    this.jsonvalue.enable();
			    break;
		    }

		    var tb = tabsEdit.findParentByType("jp_main_center_ediTreeForm").getTopToolbar();
		    tb.save.enable();
		    tabsEdit.formUnsaved = true;
		//this.jsontype.fireEvent("change");
		}
	    }
	/*

	    tabsEdit.formChanged();*/
	}, this);

	//this.jsontype.addListener('change', tabsEdit.formChanged, tabsEdit);
	this.jsonkey.addListener('change', tabsEdit.formChanged, tabsEdit);
	this.jsonvalue.addListener('change', tabsEdit.formChanged, tabsEdit);

	/*

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
	}, this);*/


	var str = "";
	var jsonKeyEvent = "";
	var jsonValueEvent = "";
	this.jsonkey.addListener('keydown', function () {
	    debug.trace("==kEY_KEYDOWN==");
	    jsonKeyEvent = "down";
	    if (!tabsEdit.formUnsaved)
		str = this.getValue();
	}, this.jsonkey);

	this.jsonkey.addListener('keyup', function () {
	    debug.trace("==kEY_KEYUP==");
	    if (str != this.getValue() && !tabsEdit.formUnsaved && jsonKeyEvent == "down")
		this.fireEvent("change");

	    jsonValueEvent = "";
	    jsonKeyEvent = "";
	    }, this.jsonkey);

	/*this.jsonkey.addListener('blur', function () {
	    debug.trace("==kEY_BLUR==");
	    if (str == this.getValue()) {
		str = "";
		jsonKeyEvent = "";
	    }
	}, this.jsonkey);*/

	this.jsonvalue.addListener('keydown', function () {
	    debug.trace("==VAL_KEYDOWN==");
	    jsonValueEvent = "down";
	    if (!tabsEdit.formUnsaved)
		str = this.getValue();
	}, this.jsonvalue);

	this.jsonvalue.addListener('keyup', function () {
	    debug.trace("==VAL_KEYUP==");
	    if (str != this.getValue() && !tabsEdit.formUnsaved && jsonValueEvent == "down")
		this.fireEvent("change");

	    jsonKeyEvent = "";
	    jsonValueEvent = "";
	    }, this.jsonvalue);

	/*this.jsonvalue.addListener('blur', function () {
	    if (str == this.getValue())
		str = "";
	}, this.jsonvalue);*/
    }
});

Ext.reg('jp_main_center_ediTreeForm_tabs_edit_key', JP.MainCenter.ediTreeForm.tabs.edit.jsonKey);