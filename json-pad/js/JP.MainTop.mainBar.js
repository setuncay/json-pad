JP.MainTop.mainBar = Ext.extend(Ext.Toolbar, {
    //id: 'JsonStringForm_tbar',
    initComponent: function() {
	this.items = [
	{
	    text: 'File',
	    ref: 'file',
	    menu: {
		ref: 'menu',
		items: [
		{
		    text: 'Save as file..',
		    statusBarTip: 'Save the JSON string as a file',
		    ref: 'save_file'
		},
		{
		    text: 'Quit',
		    statusBarTip: 'Quit the application',
		    ref: 'quit'
		}
		]
	    }
	},
	{
	    text: 'Edit',
	    ref: 'edit',
	    menu: {
		ref: 'menu',
		items: [
		{
		    text: 'XML2JSON Converter',
		    ref: 'xml2json',
		    statusBarTip: 'Convert XML data to a JSON string and insert it in the textarea'
		},
		'-',
		{
		    text: 'Copy JSON string',
		    ref: 'copy',
		    statusBarTip: 'Copy JSON string to clipboard'
		},
		{
		    text: 'Paste JSON string',
		    ref: 'paste',
		    statusBarTip: 'Paste JSON string from cliboard'
		}
		]
	    }
	},
	{
	    text: 'Help',
	    ref: 'help',
	    menu: {
		ref: 'menu',
		items: [
		{
		    text: 'Check for updates',
		    ref: 'checkUpdate',
		    statusBarTip: 'Check if updates available'
		},'-',{
		    text: 'About...',
		    ref: 'about',
		    statusBarTip: 'About the application'
		}
		]
	    }
	}
	];
	JP.MainTop.mainBar.superclass.initComponent.call(this);


	this.file.menu.quit.setHandler( JP.MainTop.Action.mainBar.quitApplication );
	this.file.menu.save_file.setHandler( JP.MainTop.Action.mainBar.saveAsFile );
	
	this.edit.menu.xml2json.setHandler( JP.MainTop.Action.openXmlWindow, this );
	this.edit.menu.copy.setHandler( JP.MainTop.Action.copyJsonStringToClipboard, this );
	this.edit.menu.paste.setHandler( JP.MainTop.Action.pasteJsonStringFromClipboard, this );

	this.help.menu.checkUpdate.setHandler( function () {
	    JPAir.updater.checkUpdate(true);
	}, this );
	this.help.menu.about.setHandler( JP.MainTop.Action.mainBar.openAboutWindow, this );


	this.file.menu.addListener("mouseover", this.onMenuMouseover);
	this.file.menu.addListener("mouseout", this.onMenuMouseout);
	this.edit.menu.addListener("mouseover", this.onMenuMouseover);
	this.edit.menu.addListener("mouseout", this.onMenuMouseout);
	this.help.menu.addListener("mouseover", this.onMenuMouseover);
	this.help.menu.addListener("mouseout", this.onMenuMouseout);
    },
    onMenuMouseover: function (menu, e, menuItem) {
	JP.util.setJPStatus({
	    text: menuItem.statusBarTip,
	    clear: false
	}, "left");
    },
    onMenuMouseout: function () {
	JP.util.setJPStatus({
	    text: "",
	    clear: false
	}, "left");
    }
});

Ext.reg('jp_main_top_mainbar', JP.MainTop.mainBar);