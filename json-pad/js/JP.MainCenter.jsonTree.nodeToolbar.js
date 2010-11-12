JP.MainCenter.jsonTree.nodeToolbar = Ext.extend(Ext.Toolbar, {
    ref: 'treetools',
    initComponent: function() {
	var me = this.findParentByType("jp_main_center_jsonTree");

	

	this.items = [
	{
	    xtype: 'button',
	    iconCls: 'icon_tree_addKey',
	    tooltip: 'Add a key/object/array',
	    ref: 'addNode',
	    menu: {
		ref: 'menu',
		items: [
		{
		    xtype: 'menuitem',
		    text: 'Add key',
		    ref: 'addKey'
		},
		{
		    xtype: 'tbseparator'
		},
		{
		    xtype: 'menuitem',
		    text: 'Add object',
		    ref: 'addObject'
		},
		{
		    xtype: 'menuitem',
		    text: 'Add array',
		    ref: 'addArray'
		}
		]
	    }
	},
	{
	    xtype: 'button',
	    iconCls: 'icon_tree_duplicate',
	    tooltip: 'Duplicate selected node',
	    disabled: true,
	    ref: 'duplicateNode'
	},
	{
	    xtype: 'button',
	    iconCls: 'icon_tree_delete',
	    tooltip: 'Delete selected node',
	    disabled: true,
	    ref: 'deleteNode'
	},
	'->',
	new Ext.form.TextField({
	    width: 100,
	    emptyText:'Search inside tree',
	    enableKeyEvents: true,
	    listeners:{
		render: function(f){
		    this.filter = new Ext.tree.TreeFilter(this, {
			clearBlank: true,
			autoClear: true
		    });
		},
		keydown: {
		    fn: function(t, e){
			this.filterNodes(t.getValue(), this);
		    },
		    buffer: 350,
		    scope: me
		},
		scope: me
	    }
	})
	];

	JP.MainCenter.jsonTree.nodeToolbar.superclass.initComponent.call(this);

	var tree = this.findParentByType("jp_main_center_jsonTree");

	this.addNode.menu.addKey.setHandler(JP.MainCenter.Action.tree.addKeyNode, tree);
	this.addNode.menu.addObject.setHandler(JP.MainCenter.Action.tree.addObjectNode, tree);
	this.addNode.menu.addArray.setHandler(JP.MainCenter.Action.tree.addArrayNode, tree);
	this.duplicateNode.setHandler(JP.MainCenter.Action.tree.duplicateNode, tree);
	this.deleteNode.setHandler(JP.MainCenter.Action.tree.deleteNode, tree);
    }
});

Ext.reg('jp_main_center_jsonTree_toolbar', JP.MainCenter.jsonTree.nodeToolbar);