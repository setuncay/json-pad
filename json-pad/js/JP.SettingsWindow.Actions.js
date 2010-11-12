JP.SettingsWindow.Action = {
    me: null,
    window: null,
    openWindow: function () {
	if(!JP.SettingsWindow.Action.window) {
	    JP.SettingsWindow.Action.window = new JP.SettingsWindow();
	}
	
	JP.SettingsWindow.Action.window.show();
    }
};

JP.SettingsWindow.Action.settingsForm = {
    save: function (fp) {
	var myform = fp.getForm();
	var values = myform.getValues();

	if ( JPAir.preferences.settings.app.jsonDefaultApp && values.jsonDefaultApp != "on" ) {
	    //debug.trace("REMOVE AS DEFAULT APPLICATION");
	    air.NativeApplication.nativeApplication.removeAsDefaultApplication("json");
	} else if ( !JPAir.preferences.settings.app.jsonDefaultApp && values.jsonDefaultApp == "on" ) {
	    //debug.trace("SET AS DEFAULT APPLICATION");
	    air.NativeApplication.nativeApplication.setAsDefaultApplication("json");
	}
//debug.dump(values, "values");
	JPAir.preferences.settings.app.syntax_hl = (values.syntaxHlOnStartup == "on" ? true : false);
	JPAir.preferences.settings.app.jsonDefaultApp = (values.jsonDefaultApp == "on" ? true : false);
	JPAir.preferences.settings.app.checkForUpdate = (values.updatesOnStartup == "on" ? true : false);
	JPAir.preferences.settings.app.jsonValidateLevel = values.jsonValidateLevel;

	//debug.dump(JPAir.preferences.settings, "JPAir.preferences.settings222")
    }
};