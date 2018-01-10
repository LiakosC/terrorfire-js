var MENU = {};
MENU.basic = {};
MENU.basic.buttons = [];
MENU.basic.build = function() {
	MENU.basic.buttons = [];
	MENU.buttonY = 100;
	MENU.basic.buttons.push(MENU.create_button("How To Play", function() {
		MENU.basic.collapse();
		MENU.how.build();
	}));
	MENU.basic.buttons.push(MENU.create_button("Credits", function() {alert("credits");}));
	MENU.basic.buttons.push(MENU.create_button("Level 1", function() {game.startLevel(1);}));
	MENU.basic.buttons.push(MENU.create_button("Level 2", function() {game.startLevel(2);}));
	MENU.basic.buttons.push(MENU.create_button("Level 3", function() {game.startLevel(3);}));
}
MENU.basic.collapse = function() {
	for (var i=0; i<MENU.basic.buttons.length; i++) {
		MENU.basic.buttons[i].button.destroy();
		MENU.basic.buttons[i].text.destroy();
	} MENU.basic.buttons = [];
}
MENU.how = {};
MENU.how.build = function() {
	MENU.how.buttons = [];
	MENU.how.text = PH.add.text(PH.canvas.width/2, 50, "A, W, S, D, Click", {font: "17px Arial", fontWeight: "bold", fill: "red"});
	MENU.how.text.anchor.setTo(0.5);
	MENU.buttonY = 500;
	MENU.how.buttons.push(MENU.create_button("Back", function() {
		MENU.how.collapse();
		MENU.basic.build();
	}));
}
MENU.how.collapse = function() {
	MENU.how.text.destroy();
	for (var i=0; i<MENU.how.buttons.length; i++) {
		MENU.how.buttons[i].button.destroy();
		MENU.how.buttons[i].text.destroy();
	}
	MENU.how.buttons = [];
}

MENU.state = {
	create: function() {
		MENU.create_button = function(text, callback) {
			var button = PH.add.button(PH.canvas.width/2, MENU.buttonY, "grey-button", function(button, pointer, isOver) {
				if (isOver && pointer.button == 0) {callback(button, pointer, isOver);}
			}, this, 1, 0, 2);
			button.scale.setTo(2);
			button.anchor.setTo(0.5);
			button.attachToCamera = true;
			var text = PH.add.text(PH.canvas.width/2, MENU.buttonY + 4, text, {font: "17px Arial", fontWeight: "bold", fill: "red"});
			text.setShadow(1, 1, "rgb(0, 0, 0)");
			text.anchor.setTo(0.5);
			MENU.buttonY += 50;
			return {button: button, text: text};
		}
		MENU.basic.build();
	}
}