JP.SettingsWindow = Ext.extend(Ext.Window, {
    layout:'fit',
    width:525,
    height:250,
    closeAction:'hide',
    plain: true,
    modal: true,
    title: 'Application Settings',
    id: 'JP_settingsWindow',
    initComponent: function() {
	var me = this;

	this.items = [{
	    xtype: 'jp_settingswindow_settingsform'
	}];

	this.buttons = [{
	    text:'Submit',
	    handler: function(){
		JP.SettingsWindow.Action.settingsForm.save( me.findByType("jp_settingswindow_settingsform")[0] );
		/*var xmlData = me.xmlForm.xmlInput.getValue();
		JP.XmlWindow.Action.setJsonData( xmlData );
		*/
	       JP.SettingsWindow.Action.window.hide();
	    }
	},{
	    text: 'Close',
	    handler: function(){
		JP.SettingsWindow.Action.window.hide();
	    }
	}];

	JP.SettingsWindow.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_settingswindow', JP.SettingsWindow);