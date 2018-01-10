var LOADING = {};
LOADING.image = undefined;
LOADING.bar_empty = undefined;
LOADING.bar = undefined;
LOADING.state = {
	preload: function() {
		LOADING.image = PH.add.sprite(0, 0, "loading");
		LOADING.image.inputEnabled = true;
		LOADING.bar_empty = PH.add.sprite(PH.canvas.width/2, 500, "loading_bar_empty");
		LOADING.bar_empty.anchor.setTo(0.5);
		LOADING.bar = PH.add.sprite(PH.canvas.width/2, 500, "loading_bar");
		LOADING.bar.anchor.setTo(0.5);
		LOADING.bar.scale.setTo(0, 1);
		PH.load.onFileComplete.add(function() {LOADING.bar.scale.setTo(PH.load.progress / 100, 1);});
		PH.load.onLoadComplete.add(function() {
			var sprite = PH.add.sprite(PH.canvas.width/2, 400, "loading_completed");
			sprite.anchor.setTo(0.5);
			var sprite = PH.add.sprite(PH.canvas.width/2, 500, "click_to_continue");
			sprite.anchor.setTo(0.5);
			sprite.animations.add(0);
			sprite.animations.play(0, 25, true);
			LOADING.bar.destroy();
			LOADING.bar_empty.destroy();
			LOADING.image.events.onInputDown.add(function() {
				PH.state.start("menu");
			});
			LOADING.image.events.onInputOver.addOnce(function() {
				PH.canvas.style.cursor = "pointer";
			});
			LOADING.image.events.onInputOut.addOnce(function() {PH.canvas.style.cursor = "default";});
		});
		// ------------------------------------------------------------------ //
		var img = function(img) {PH.load.image(img, "images/" + img + ".png");}
		PH.load.spritesheet("button", "images/button.png", 193, 213/3);
		PH.load.spritesheet("grey-button", "images/grey-button.png", 80, 60/3);
		PH.load.image("sexy", "images/sexy.jpg");
		PH.load.image("earth", "images/earth.png");
		PH.load.image("light_grass", "images/light_grass.png");
		PH.load.image("scorched_earth", "images/scorched_earth.png");
		PH.load.image("hero", "images/hero.png");
		PH.load.image("bullet", "images/bullet.png");
		PH.load.audio("music", ["sounds/music.ogg"]);
		PH.load.audio("shot", "sounds/shot.wav");
		PH.load.audio("siren", ["sounds/siren.mp3", "sounds/siren.ogg"]);
		PH.load.audio("victory", "sounds/victory.ogg");
		PH.load.image("zombie", "images/zombie.png");
		PH.load.image("death_image", "images/death_image.png");
		PH.load.image("death_mainMenu", "images/death_mainMenu.png");
		PH.load.image("death_restart", "images/death_restart.png");
		PH.load.image("exit", "images/exit.png");
	}
}