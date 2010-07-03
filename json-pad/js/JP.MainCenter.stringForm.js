JP.MainCenter.stringForm = Ext.extend(Ext.FormPanel, {
    title: '',
    region: 'north',
    layout: 'fit',
    split: true,
    height: 200,
    id: 'JPsouth',
    initComponent: function() {
	var me = this;

	this.items = [
	{
	    xtype: 'ux-codemirror',
	    codeMirrorPath: (Ext.isAir ? constant.codeMirrorPath.air : constant.codeMirrorPath.web),
	    language: 'js',
	    hideLabel: true,
	    name: 'jsonString',
	    initCallBackFn: function (cm) {
		me.setWidth(me.getWidth()-1); //@todo Little bug in codemirror... this line helps at the moment

		if (JPAir.preferences.settings.syntax_hl == "false") {
		    Ext.getCmp("JPviewPort").findByType("jp_main_top")[0].getTopToolbar().findByType("jp_main_top_iconbar")[0].btnGroup_others.switchHighlighting.toggle(false, true);
		    cm.hideCodeMirror();
		}
	    }
	}
	];

	this.bbar = {
	    xtype: 'statusbar',
	    id: 'JPstringInputStatusBar', //@todo maybe without ids...
	    statusAlign: 'left',
	    autoClear: 2500,
	    defaultText: '',
	    text: '',
	    iconCls: ''
	};

	JP.MainCenter.stringForm.superclass.initComponent.call(this);

	me.addListener("resize", function () {
	    var errorWindow = Ext.getCmp("JP_errorWindow");

	    if (errorWindow) {
		if ( errorWindow.isVisible() ) {
		    var errorContainer = Ext.get(Ext.query(".x-status-text")[0]);
		    var cmp = Ext.getCmp(errorContainer.id);
		    var pos = cmp.getPosition();

		    JP.ErrorWindow.Action.window.setPosition( pos[0]+25, pos[1] );
		}
	    }
	});
    }
});

Ext.reg('jp_main_center_stringForm', JP.MainCenter.stringForm);