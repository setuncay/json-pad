JP.SettingsWindow.settingsForm = Ext.extend(Ext.FormPanel, {
    layout: 'form',
    frame: true,
    ref: 'settingsForm',
    labelWidth: 270,
    initComponent: function() {
	this.items = [{
	    xtype: 'checkbox',
	    fieldLabel: 'Register *.json files for JSONpad',
	    name: 'jsonDefaultApp',
	    checked: JPAir.preferences.settings.app.jsonDefaultApp
	},{
	    xtype: 'checkbox',
	    fieldLabel: 'Activate syntax highlighting on startup',
	    name: 'syntaxHlOnStartup',
	    checked: JPAir.preferences.settings.app.syntax_hl
	},{
	    xtype: 'checkbox',
	    fieldLabel: 'Check for updates on startup',
	    name: 'updatesOnStartup',
	    checked: JPAir.preferences.settings.app.checkForUpdate
	},{
	    xtype:          'combo',
	    mode:           'local',
	    value:          'strict',
	    triggerAction:  'all',
	    forceSelection: true,
	    ref:            'jsonValidateLevel',
	    //editable:       false,
	    fieldLabel:     'JSON Validate Level',
	    name:           'jsonValidateLevel',
	    hiddenName:     'jsonValidateLevel_hidden',
	    displayField:   'caption',
	    valueField:     'type',
	    tpl: combo_datatype,
	    store: new Ext.data.ArrayStore({
		fields: ['caption', 'type'],
		data : [
		['Strict', 'strict'],
		['Easy', 'easy']
		]
	    })
	}];

	JP.SettingsWindow.settingsForm.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_settingswindow_settingsform', JP.SettingsWindow.settingsForm);