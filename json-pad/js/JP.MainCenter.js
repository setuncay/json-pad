JP.MainCenter = Ext.extend(Ext.Panel, {
    title: '',
    region: 'center',
    layout: 'border',
    border: false,
    //activeTab: 0,
    //id: 'JPsouth',
    initComponent: function() {
	/*this.bbar = {
	    xtype: 'toolbar',
	    //id: 'JPbottomStatusBar',
	    ref: 'jpstatus',
	    items: [
	    {
		xtype: 'tbtext',
		text: 'Text Item'
	    },
	    {
		xtype: 'tbfill'
	    },
	    {
		xtype: 'tbtext',
		text: 'Text Item'
	    }
	    ]
	};*/

	this.items = [
	   {xtype: 'jp_main_center_stringForm'},
	   {xtype: 'jp_main_center_jsonTree'},
	   {xtype: 'jp_main_center_ediTreeForm'}
	];

	JP.MainCenter.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_main_center', JP.MainCenter);