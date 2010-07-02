JP.MainTop = Ext.extend(Ext.Panel, {
    title: '',
    region: 'north',
    id: 'JPtop',
    initComponent: function() {
	this.tbar = {
	    xtype: 'container',
	    layout: 'anchor',
	    cls: 'parentToolbar',
	    items: [{
		xtype: 'jp_main_top_mainbar'
	    },{
		xtype: 'jp_main_top_iconbar'
	    }]
	};
	JP.MainTop.superclass.initComponent.call(this);
    }
});

Ext.reg('jp_main_top', JP.MainTop);