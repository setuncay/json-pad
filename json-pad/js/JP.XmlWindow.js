JP.XmlWindow = Ext.extend(Ext.Window, {
    layout:'fit',
    width:700,
    height:500,
    closeAction:'hide',
    plain: true,
    modal: true,
    title: 'Convert XML data to a JSON string',
    id: 'JP_convertXmlWindow',
    initComponent: function() {
	var me = this;

	this.items = [{
	    xtype: 'jp_xmlwindow_xmlform'
	}];

	this.buttons = [{
	    text:'Submit',
	    handler: function(){
		var xmlData = me.xmlForm.xmlInput.getValue();
		JP.XmlWindow.Action.setJsonData( xmlData );
		JP.XmlWindow.Action.window.hide();
	    }
	},{
	    text: 'Close',
	    handler: function(){
		JP.XmlWindow.Action.window.hide();
	    }
	}];

	JP.XmlWindow.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_xmlwindow', JP.XmlWindow);