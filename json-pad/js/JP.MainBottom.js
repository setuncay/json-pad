JP.MainBottom = Ext.extend(Ext.Panel, {
    title: '',
    region: 'south',
    cls: 'main-bottom-panel',
    //id: 'JPsouth',
    initComponent: function() {
	this.bbar = {
	    xtype: 'statusbar',
	    id: 'JPmainStatusBar',
	    ref: 'jpstatus',
	    statusAlign: 'left',
	    autoClear: 2500,
	    defaultText: '',
	    text: '',
	    iconCls: '',
	    items: [
	    ' ',
	    {
		xtype: 'tbtext',
		id: 'JPmainStatusBar_Right',
		text: '&nbsp;'
	    }
	    ]
	};
	JP.MainBottom.superclass.initComponent.call(this);

	this.addListener("afterrender", function () {
	    this.updateContent("/");
	}, this);
    },
    updateContent: function (str) {
	Ext.get(Ext.query("div.main-bottom-panel div.x-panel-body")[0]).update( str );
    }
});

Ext.reg('jp_main_bottom', JP.MainBottom);