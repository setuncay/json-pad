JP.AboutWindow.Action = {
    me: null,
    window: null,
    openWindow: function () {
	if(!JP.AboutWindow.Action.window) {
	    JP.AboutWindow.Action.window = new JP.AboutWindow();
	}
	JP.AboutWindow.Action.window.show();
    }
};