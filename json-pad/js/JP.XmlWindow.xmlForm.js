JP.XmlWindow.xmlForm = Ext.extend(Ext.FormPanel, {
    layout: 'form',
    frame: false,
    hideLabel: true,
    ref: 'xmlForm',
    initComponent: function() {
	var me = this;

	this.tbar = {
	    items: [{
		xtype: 'buttongroup',
		title: 'Clipboard',
		columns: 2,
		ref: 'btnGroup_clipboard',
		items: [
		{
		    iconCls: 'icon_copy',
		    scale: 'medium',
		    tooltip: 'Copy JSON into clipboard',
		    ref: 'copy'
		},
		{
		    iconCls: 'icon_paste',
		    scale: 'medium',
		    tooltip: 'Paste JSON from clipboard',
		    ref: 'paste'
		}
		]
	    },
	    {
		xtype: 'buttongroup',
		title: 'Tools',
		columns: 2,
		ref: 'btnGroup_others',
		items: [
		{
		    iconCls: 'icon_highlight',
		    scale: 'medium',
		    tooltip: 'Turn on/off syntax highlighting',
		    ref: 'switchHighlighting',
		    enableToggle: true,
		    pressed: true
		}
		]
	    }]
	};

	this.items = [{
	    xtype: 'ux-codemirror',
	    codeMirrorPath: 'core/extern/CodeMirror',
	    language: 'xml',
	    hideLabel: true,
	    anchor: '100% 100%',
	    name: 'xmlData',
	    ref: 'xmlInput',
	    onResizeCallBackFn: function (codeMirror) {
		//@todo Hier gibts sicher ne bessere Möglichkeit...Unterschied zum normalem Resizen ist das immer das Form elemente genommen werden muss
		var el = Ext.select('.'+codeMirror.id, true);
		var lineNumbersEl = Ext.select("."+codeMirror.id+" ~ div", true);

		var win = me;
		var width = win.getWidth();
		var height = win.getHeight();

		if (el){
		    if ( codeMirror.initialized && !codeMirror.codeMirrorHidden && lineNumbersEl && count(lineNumbersEl.elements) && width )
			width = width - lineNumbersEl.elements[0].getWidth();

		    for (var i=0; i< el.elements.length; i++)
		    {
			if (width && !height)
			    el.elements[i].setWidth(width);
			else if (!width && height)
			    el.elements[i].setHeight(height);
			else if (width && height)
			    el.elements[i].setSize(width-3, height-1);

			lineNumbersEl.elements[i].setHeight(height);
		    }
		}
	    },
	    initCallBackFn: function (me) {
		me.findParentByType("jp_xmlwindow").setWidth(me.findParentByType("jp_xmlwindow").getWidth()-1);
		JP.XmlWindow.Action.setXmlData();
	    }
	}];

	

	JP.XmlWindow.xmlForm.superclass.initComponent.call(this);

	var tb = this.getTopToolbar();

	tb.btnGroup_clipboard.copy.setHandler( JP.XmlWindow.Action.tbar.copyXmlStringToClipboard, this );
	tb.btnGroup_clipboard.paste.setHandler( JP.XmlWindow.Action.tbar.pasteXmlStringFromClipboard, this );

	tb.btnGroup_others.switchHighlighting.on("toggle", JP.XmlWindow.Action.tbar.switchHighlighting, this);
    }
});

Ext.reg('jp_xmlwindow_xmlform', JP.XmlWindow.xmlForm);