game = {};
game.startLevel = function(level) {
	game.level = level;
	PH.state.start("game");
}
game.create_hero = function(x, y) {
	try {game.hero.remove();} catch(e) {}
	game.hero = new Unit(x, y, "hero");
	game.hero.sprite.scale.setTo(0.7, 0.7);
	game.move4 = new Move4(game.hero.body, keys.up, keys.right, keys.down, keys.left, 150);
	PH.camera.follow(game.hero.body);
	
	game.healthBar_empty = PH.add.graphics();
	game.healthBar_empty.y = PH.canvas.height - 26;
	game.healthBar_empty.x = 5;
	game.healthBar_empty.fixedToCamera = true;
	game.healthBar_empty.lineStyle(2, 0x015900, 1);
	game.healthBar_empty.beginFill(0x000000, 0.5);
	game.healthBar_empty.drawRect(0, 0, 150, 21);
	
	game.healthBar = PH.add.graphics();
	game.healthBar.x = 5;
	game.healthBar.y = PH.canvas.height - 26;
	game.healthBar.fixedToCamera = true;
	game.healthBar.beginFill(0x20F73C, 0.5);
	game.healthBar.drawRect(2, 2, 146, 17);
	
	game.updateHealthBar = function() {
		game.healthBar.clear();
		var coef = game.hero.hp / game.hero.hpMax;
		var width = 146 * coef;
		game.healthBar.beginFill(0x20F73C, 0.5);
		game.healthBar.drawRect(2, 2, width, 17);
	}
}
game.create_zombie = function(x, y) {
	var zombie = new Unit(x, y, "zombie");
	zombie.sprite.scale.setTo(0.6);
	zombie.speed = 50;
	zombie.ai.attack = function() {
		zombie.moveToAngle(PH.math.angleBetween(zombie.body.x, zombie.body.y, game.hero.body.x, game.hero.body.y));
	}
	zombie.ai.smellCallback = function() {
		zombie.ai.attack();
		zombie.ai.smellTimer = PH.time.events.add(PH.rnd.integerInRange(200, 500), function() {zombie.ai.smellCallback();});
	}
	zombie.ai.smellTimer = PH.time.events.add(PH.rnd.integerInRange(200, 500), function() {zombie.ai.smellCallback();});
	zombie.ai.swingCdMax = 1000;
	zombie.ai.swingCd		= 1000;
	zombie.ai.phaserUpdate = function() {
		zombie.ai.swingCd -= PH.time.physicsElapsedMS;
		if (zombie.ai.swingCd < 0) {
			var range = PH.math.distance(zombie.body.x, zombie.body.y, game.hero.body.x, game.hero.body.y);
			if (range < 50) {
				zombie.swing(200, 10);
				zombie.ai.swingCd = zombie.ai.swingCdMax;
			}
		}
	}
	return zombie;
}
game.getAliveEnemies = function() {
	var r = [];
	for (var key in game.units) {
		if (game.units[key] !== game.hero && game.units[key].alive) {
			r.push(game.units[key]);
		}
	} return r;
}
game.exit = function() {
	sounds.music.stop();
	sounds.siren.stop();
	sounds.victory.stop();
	PH.state.start("menu");
}
game.deathPop = {};
game.deathPop.build = function() {
	game.deathPop.image = PH.add.sprite(PH.canvas.width/2, PH.canvas.height/2, "death_image");
	game.deathPop.image.fixedToCamera = true;
	game.deathPop.image.anchor.setTo(0.5);
	game.deathPop.restart = PH.add.sprite(game.deathPop.image.x + 110, game.deathPop.image.y + 50, "death_restart");
	game.deathPop.restart.fixedToCamera = true;
	game.deathPop.restart.anchor.setTo(0.5);
	game.deathPop.restart.inputEnabled = true;
	game.deathPop.restart.events.onInputOver.addOnce(function() {PH.canvas.style.cursor = "pointer";});
	game.deathPop.restart.events.onInputOut.addOnce(function() {PH.canvas.style.cursor = "default";});
	game.deathPop.restart.events.onInputDown.addOnce(function() {
		sounds.music.stop();
		sounds.siren.stop();
		game.startLevel(game.level);
	});
	game.deathPop.mainMenu = PH.add.sprite(game.deathPop.image.x - 110, game.deathPop.image.y + 50, "death_mainMenu");
	game.deathPop.mainMenu.fixedToCamera = true;
	game.deathPop.mainMenu.anchor.setTo(0.5);
	game.deathPop.mainMenu.inputEnabled = true;
	game.deathPop.mainMenu.events.onInputOver.addOnce(function() {PH.canvas.style.cursor = "pointer";});
	game.deathPop.mainMenu.events.onInputOut.addOnce(function() {PH.canvas.style.cursor = "default";});
	game.deathPop.mainMenu.events.onInputDown.addOnce(function() {game.exit();});
}
game.state = {
	create: function() {
		PH.canvas.style.cursor = "crosshair";
		game.units = {};	
		game.bullets = {};
		game.bullets_index = 1;
		keys.up = PH.input.keyboard.addKey(Phaser.Keyboard.W);
		keys.right = PH.input.keyboard.addKey(Phaser.Keyboard.D);
		keys.down = PH.input.keyboard.addKey(Phaser.Keyboard.S);
		keys.left = PH.input.keyboard.addKey(Phaser.Keyboard.A);
		// AUDIO
		sounds.music = PH.add.audio("music", 10, true);
		sounds.siren = PH.add.audio("siren", 0.6);
		sounds.shot = PH.add.audio("shot", 0.8);
		sounds.victory = PH.add.audio("victory", 1);
		sounds.music.play();
		LEVELS[game.level]();
		game.exitSprite = PH.add.sprite(PH.canvas.width - 5, PH.canvas.height - 5, "exit");
		game.exitSprite.fixedToCamera = true;
		game.exitSprite.anchor.setTo(1);
		game.exitSprite.inputEnabled = true;
		game.exitSprite.events.onInputDown.addOnce(function() {game.exit();});
		game.exitSprite.events.onInputOut.addOnce(function() {PH.canvas.style.cursor = "crosshair";});
		game.exitSprite.events.onInputOver.addOnce(function() {PH.canvas.style.cursor = "pointer";});
		
		PH.input.onDown.add(function(pointer) {
			var angle = PH.math.angleBetween(game.hero.body.x, game.hero.body.y, PH.input.worldX, PH.input.worldY);
			if (pointer.button == 0) { // LEFT CLICK
				if (game.hero.alive) {
					sounds.shot.play();
					var bullet = PH.add.sprite(game.hero.body.x, game.hero.body.y, "bullet");
					if (game.bullets[game.bullets_index] !== undefined) {
						game.bullets[game.bullets_index].destroy();
						delete game.bullets[game.bullets_index];
					}
					game.bullets[game.bullets_index] = bullet;
					game.bullets_index++;
					if (game.bullets_index > 10) {game.bullets_index = 1;}
					
					bullet.anchor.setTo(0.5);
					bullet.rotation = angle;
					var velocity = 2000;
					PH.physics.arcade.enable(bullet);
					bullet.body.velocity.x = velocity * Math.cos(angle);
					bullet.body.velocity.y = velocity * Math.sin(angle);
				}
			} else if (pointer.button == 2) { // RIGHT CLICK
				
			} else if (pointer.button == 1) { // MIDDLE CLICK
				
			}
		});
	},
	update: function() {
		if (game.hero.alive) {
			game.hero.body.rotation = PH.math.angleBetween(game.hero.body.x, game.hero.body.y, PH.input.worldX, PH.input.worldY);
			for (var key in game.units) {
				if (game.units[key] !== game.hero) {
					if (game.units[key].ai.phaserUpdate !== undefined) {game.units[key].ai.phaserUpdate();}
				}
			}
		}
		for (var bulletKey in game.bullets) {
			for (var unitKey in game.units) {
				if (game.units[unitKey] !== game.hero && game.units[unitKey].alive) {
					PH.physics.arcade.collide(game.bullets[bulletKey], game.units[unitKey].body, function() {
						game.units[unitKey].getDamaged(15);
						game.bullets[bulletKey].destroy();
						delete game.bullets[bulletKey];
					});
				}
			}
		}
	}
}

var Move4 = function(sprite, up, right, down, left, velocity) {
	var THIS = this;
	this.sprite = sprite;
	this.up = up;
	this.right = right;
	this.down = down;
	this.left = left;
	this.dir = null;
	this.velocity = velocity || 0;
	this.pressed = [false, false, false, false];
	this.enabled = true;
	up.onDown.add(function() {
		THIS.pressed[0] = true;
		THIS.pressed[2] = false;
		THIS.update();
	});
	down.onDown.add(function() {
		THIS.pressed[0] = false;
		THIS.pressed[2] = true;
		THIS.update();
	});
	left.onDown.add(function() {
		THIS.pressed[3] = true;
		THIS.pressed[1] = false;
		THIS.update();
	});
	right.onDown.add(function() {
		THIS.pressed[3] = false;
		THIS.pressed[1] = true;
		THIS.update();
	});
	up.onUp.add(function() {
		THIS.pressed[0] = false;
		THIS.update();
	});
	down.onUp.add(function() {
		THIS.pressed[2] = false;
		THIS.update();
	});
	left.onUp.add(function() {
		THIS.pressed[3] = false;
		THIS.update();
	});
	right.onUp.add(function() {
		THIS.pressed[1] = false;
		THIS.update();
	});
	this.update = function() {
		if (this.enabled) {
			var V = this.velocity;
			var v = this.velocity * Math.sqrt(2) / 2;
			if (this.pressed[0] && this.pressed[1]) {
				this.dir = 1;
				this.sprite.body.velocity.x = v;
				this.sprite.body.velocity.y = -v;
			} else if (this.pressed[1] && this.pressed[2]) {
				this.dir = 3;
				this.sprite.body.velocity.x = v;
				this.sprite.body.velocity.y = v;
			} else if (this.pressed[2] && this.pressed[3]) {
				this.dir = 5;
				this.sprite.body.velocity.x = -v;
				this.sprite.body.velocity.y = v;
			} else if (this.pressed[4] && this.pressed[0]) {
				this.dir = 7;
				this.sprite.body.velocity.x = -v;
				this.sprite.body.velocity.y = -v;
			} else if (this.pressed[0]) {
				this.dir = 0;
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = -V;
			} else if (this.pressed[1]) {
				this.dir = 2;
				this.sprite.body.velocity.x = V;
				this.sprite.body.velocity.y = 0
			} else if (this.pressed[2]) {
				this.dir = 4;
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = V;
			} else if (this.pressed[3]) {
				this.dir = 6;
				this.sprite.body.velocity.x = -V;
				this.sprite.body.velocity.y = 0;
			} else {
				this.dir = null;
				this.sprite.body.velocity.x = 0;
				this.sprite.body.velocity.y = 0;
			}
		}
		//console.log(this.pressed, this.dir);
	}
}

function Unit(x, y, texture) {
	console.log(this);
	this.body = PH.add.sprite(x, y, null);
	this.body.anchor.setTo(0.5);
	PH.physics.arcade.enable(this.body);
	this.body.body.setSize(50, 50);
	this.body.body.collideWorldBounds = true;
	this.body.body.immovable = true;
	this.body.texture.baseTexture.skipRender = false; // mySprite.texture.baseTexture.skipRender = false
	this.sprite = PH.add.sprite(0, 0, texture);
	this.sprite.anchor.setTo(0.5);
	
	this.body.addChild(this.sprite);
	this.alive = true;
	this.hp = 100;
	this.hpMax = 100;
	this.speed = 100;
	
	this.ai = {};
	
	var i = 0; while (game.units[i] !== undefined) {i++;}
	game.units[i] = this;
	this.key = i;
	
	this.stop = function() {
		if (this.alive) {
			this.body.body.velocity.x = 0;
			this.body.body.velocity.y = 0;
		}
	}
	this.moveToAngle = function(angle) {
		if (this.alive) {
			this.body.rotation = angle;
			this.body.body.velocity.x = this.speed * Math.cos(angle);
			this.body.body.velocity.y = this.speed * Math.sin(angle);
		}
	}
	this.swing = function(interval, damage) { // ONLY AGAINST HERO
		if (this.alive) {
			PH.time.events.add(interval, function() {game.hero.getDamaged(damage);});
		}
	}
	this.getDamaged = function(damage) {
		if (this.alive) {
			this.hp -= damage;
			if (this.hp <= 0) {
				this.hp = 0;
				this.die();
			}
			if (this == game.hero) {
				game.updateHealthBar();
			}
		}
	}
	this.die = function() {
		if (this.alive) {
			this.stop();
			this.alive = false;
			var tween = PH.add.tween(this.sprite).to({alpha:0.2}, 800, Phaser.Easing.Linear.None, true);
			if (this == game.hero) {
				game.move4.enabled = false;
				sounds.music.stop();
				sounds.siren.play();
				game.deathPop.build();
			} else {
				var enemies = game.getAliveEnemies();
				if (enemies.length == 0) {
					sounds.music.stop();
					sounds.victory.play();
				}
			}
		}
	}
	this.remove = function() {
		this.sprite.destroy();
		this.body.destroy();
		delete game.units[this.key];
	}
}

























