var LEVELS = {};
LEVELS[1] = function() {
	PH.world.setBounds(0, 0, 700, 600);
	PH.add.tileSprite(0, 0, PH.world.width, PH.world.height, "light_grass");
	game.create_hero(100, PH.world.height - 100);
	game.create_zombie(400, PH.world.height - 400);
}
LEVELS[2] = function() {
	PH.world.setBounds(0, 0, 1200, 1200);
	PH.add.tileSprite(0, 0, PH.world.width, PH.world.height, "earth"); 
	game.create_hero(100, 100);
	
	game.create_zombie(400, 100);
	game.create_zombie(400, 400);
	game.create_zombie(100, 400);
}
LEVELS[3] = function() {
	var a, b, x, y, zombie;
	PH.world.setBounds(0, 0, 1200, 1200);
	PH.add.tileSprite(0, 0, PH.world.width, PH.world.height, "scorched_earth");
	game.create_hero(PH.world.width / 2, PH.world.height / 2);
	for (var i=0; i<100; i++) {
		a = PH.rnd.integerInRange(1, 2);
		b = PH.rnd.integerInRange(1, 2);
		if (a == 1) {x = PH.rnd.integerInRange(0, 400);}
		else if (a == 2) {x = PH.rnd.integerInRange(800, 1200);}
		if (b == 1) {y = PH.rnd.integerInRange(0, 400);}
		else if (b == 2) {y = PH.rnd.integerInRange(800, 1200);}
		zombie = game.create_zombie(x, y);
		zombie.speed = 10;
	}
}