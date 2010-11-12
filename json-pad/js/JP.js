/**
 * An Application
 *
 * @author    Ing. Jozef Sakáloš
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      2. April 2008
 * @version   $Id$
 *
 * @license application.js is licensed under the terms of the Open Source
 * LGPL 3.0 license. Commercial use is permitted to the extent that the
 * code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

/*global Ext, JP */

if ( Ext.isAir ) {
    console = {
	log: air.Introspector ? air.Introspector.Console.log : function(){}
    };

    // Very bad solution for combobox use
    var combo_datatype = new Ext.XTemplate(
	'<tpl for="."><div class="x-combo-list-item">{caption}</div></tpl>'
	);
}

var deactivateTrigger = false;

function init () {
    if ( Ext.isAir ) {
	JPAir.app.xmlInfo = air.NativeApplication.nativeApplication.applicationDescriptor;
	debug.trace(JPAir.app.xmlInfo);
	JPAir.init();

	if (JPAir.app.getApplicationInfo()[2] == "JSONpad-air.html") air.Introspector.Console.info();
    } else {
	$.ajax({
	    type: "GET",
	    url: "application.xml",
	    dataType: "xml",
	    success: function (xml) {
		var xmlStr = $(xml).outerHTML();
		xmlStr = xmlStr.replace(/initialwindow/g,"initialWindow");
		
		JPAir.app.xmlInfo = xmlStr;
	    }
	});
    }
}

Ext.BLANK_IMAGE_URL = 'core/extjs/resources/images/default/s.gif';
Ext.ns('JP');

// application main entry point
Ext.onReady(function() {
    Ext.QuickTips.init();
    
    var viewport = new Ext.Viewport({
	layout: 'border',
	id: 'JPviewPort',
	items: [
	{
	    xtype:'jp_main_top'
	},

	{
	    xtype:'jp_main_center'
	},

	{
	    xtype:'jp_main_bottom'
	}
	]
    });
}); // eo function onReady