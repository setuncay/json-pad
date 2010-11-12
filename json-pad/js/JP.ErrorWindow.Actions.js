JP.ErrorWindow.Action = {
    me: null,
    window: null,
    init: function () {
	if(!JP.ErrorWindow.Action.window)
	    JP.ErrorWindow.Action.window = new JP.ErrorWindow();
    },
    openWindow: function () {
	if(!JP.ErrorWindow.Action.window) {
	    JP.ErrorWindow.Action.init();
	}

	JP.ErrorWindow.Action.window.show();
    }
};