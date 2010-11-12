JP.MainCenter.jsonTree.contextMenu = Ext.extend(Ext.menu.Menu, {
    initComponent: function() {
	this.items = [{
	    text: 'Add',
	    iconCls: 'icon_tree_addKey',
	    ref: 'addNode',
	    menu: {
		ref: 'menu',
		items: [
		{
		    text: 'Add Key',
		    ref: 'addKey'
		},
		'-',
		{
		    text: 'Add Object',
		    ref: 'addObject'
		},
		{
		    text: 'Add Array',
		    ref: 'addArray'
		}
		]
	    }
	},{
	    text: 'Duplicate',
	    iconCls: 'icon_tree_duplicate',
	    ref: 'duplicateNode'
	}, '-',{
	    text: 'Delete',
	    iconCls: 'icon_tree_delete',
	    ref: 'deleteNode'
	}];

	JP.MainCenter.jsonTree.contextMenu.superclass.initComponent.call(this);

	var tree = Ext.getCmp("JPviewPort").findByType("jp_main_center_jsonTree")[0];

	this.addNode.menu.addKey.setHandler(JP.MainCenter.Action.tree.addKeyNode, tree);
	this.addNode.menu.addObject.setHandler(JP.MainCenter.Action.tree.addObjectNode, tree);
	this.addNode.menu.addArray.setHandler(JP.MainCenter.Action.tree.addArrayNode, tree);
	this.duplicateNode.setHandler(JP.MainCenter.Action.tree.duplicateNode, tree);
	this.deleteNode.setHandler(JP.MainCenter.Action.tree.deleteNode, tree);
    }
});

Ext.reg('jp_main_center_jsonTree_contextMenu', JP.MainCenter.jsonTree.contextMenu);