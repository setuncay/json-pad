JP.ErrorWindow = Ext.extend(Ext.Window, {
    layout:'fit',
    //width:300,
   // height:30,
    closeAction:'hide',
    plain: true,
    x: 0,
    y: 0,
    //html: 'blub?',
    /*modal: true,*/
    //title: 'Convert XML<br />data to<br />a JSON string',
    //constrainHeader: true,
    baseCls: 'x-tip',
    bodyBorder: false,
    draggable: false,
    resizable: false,
    html: "Dummytext",
    //constrainHeader: false,
    //header: false,
   /* bodyCfg: {
	cls: 'i-wanna-hide'
    },*/
    //bodyStyle: 'display:none',
    //unstyled: true,
    id: 'JP_errorWindow',
    initComponent: function() {
	var me = this;

	/*this.listeners = {
            beforeshow: function updateDialogBody(tip) {
                tip.body.dom.innerHTML = 'TEXXXXT!!';
            }
	};*/

	/*this.items = [{
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
	}];*/

	JP.ErrorWindow.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_errorwindow', JP.ErrorWindow);